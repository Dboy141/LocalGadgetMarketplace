"use client";

import { seedData } from "./seedData";

const STORAGE_KEY = "local-gadget-marketplace-data";

function isBrowser() {
    return typeof window !== "undefined";
}

function loadData() {
    if (!isBrowser()) {
        return structuredClone(seedData);
    }

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return structuredClone(seedData);
    }

    return JSON.parse(saved);
}

function saveData(data) {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function nextId(items) {
    if (!items.length) return 1;
    return Math.max(...items.map((item) => item.id)) + 1;
}

function notifyAuthChanged() {
    if (isBrowser()) {
        window.dispatchEvent(new Event("authChanged"));
    }
}

function notifyCartUpdated() {
    if (isBrowser()) {
        window.dispatchEvent(new Event("cartUpdated"));
    }
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildLowStockAlert(data, inventoryRow) {
    const product = data.products.find((item) => item.id === inventoryRow.productId);
    const location = data.locations.find((item) => item.id === inventoryRow.locationId);

    if (!product || !location) return;

    const alreadyExists = data.alerts.some(
        (alert) =>
            alert.productId === inventoryRow.productId &&
            alert.locationId === inventoryRow.locationId &&
            alert.status === "Active"
    );

    if (alreadyExists) return;

    data.alerts.push({
        id: nextId(data.alerts),
        productId: inventoryRow.productId,
        locationId: inventoryRow.locationId,
        productName: product.name,
        locationName: location.name,
        stock: inventoryRow.stock,
        lowStockThreshold: inventoryRow.lowStockThreshold,
        status: "Active",
        createdAt: new Date().toISOString(),
    });
}

function refreshAlertsForInventory(data) {
    data.inventory.forEach((row) => {
        if (row.stock <= row.lowStockThreshold) {
            buildLowStockAlert(data, row);
        }
    });
}

/* =========================================================
   MOCK DATA RESET
========================================================= */

export function resetMockData() {
    saveData(structuredClone(seedData));
    notifyAuthChanged();
    notifyCartUpdated();
}

/* =========================================================
   AUTH FUNCTIONS
========================================================= */

export function getCurrentUser() {
    return loadData().currentUser;
}

export function isAdmin() {
    const user = getCurrentUser();
    return user?.role === "admin";
}

export function signupUser(form) {
    const data = loadData();

    const exists = data.users.some(
        (user) => user.email.toLowerCase() === form.email.toLowerCase()
    );

    if (exists) {
        return {
            success: false,
            message: "An account already exists with this email.",
        };
    }

    if (form.password.length < 6) {
        return {
            success: false,
            message: "Password must be at least 6 characters.",
        };
    }

    const user = {
        id: nextId(data.users),
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: "user",
    };

    data.users.push(user);

    data.currentUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    };

    saveData(data);
    notifyAuthChanged();

    return {
        success: true,
        message: "Account created successfully.",
    };
}

export function loginUser(email, password) {
    const data = loadData();

    const user = data.users.find(
        (item) =>
            item.email.toLowerCase() === email.toLowerCase() &&
            item.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Invalid email or password.",
        };
    }

    data.currentUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    };

    saveData(data);
    notifyAuthChanged();

    return {
        success: true,
        message: "Login successful.",
    };
}

export function logoutUser() {
    const data = loadData();
    data.currentUser = null;

    saveData(data);
    notifyAuthChanged();
}

/* =========================================================
   LOCATION FUNCTIONS
========================================================= */

export function getLocations() {
    return loadData().locations;
}

export function addLocation(location) {
    const data = loadData();

    const newLocation = {
        id: nextId(data.locations),
        ...location,
    };

    data.locations.push(newLocation);

    data.products.forEach((product) => {
        const alreadyExists = data.inventory.some(
            (row) => row.productId === product.id && row.locationId === newLocation.id
        );

        if (!alreadyExists) {
            data.inventory.push({
                productId: product.id,
                locationId: newLocation.id,
                price: 0,
                stock: 0,
                lowStockThreshold: 0,
            });
        }
    });

    saveData(data);
}

export function updateLocation(id, updates) {
    const data = loadData();

    data.locations = data.locations.map((location) => {
        if (location.id === id) {
            return {
                ...location,
                ...updates,
            };
        }

        return location;
    });

    saveData(data);
}

export function deleteLocation(id) {
    const data = loadData();

    data.locations = data.locations.filter((location) => location.id !== id);
    data.inventory = data.inventory.filter((row) => row.locationId !== id);
    data.cart = data.cart.filter((item) => item.locationId !== id);
    data.alerts = data.alerts.filter((alert) => alert.locationId !== id);

    saveData(data);
    notifyCartUpdated();
}

/* =========================================================
   PRODUCT FUNCTIONS
========================================================= */

export function getProducts() {
    return loadData().products;
}

export function addProduct(product) {
    const data = loadData();

    const newProduct = {
        id: nextId(data.products),
        ...product,
    };

    data.products.push(newProduct);

    data.locations.forEach((location) => {
        data.inventory.push({
            productId: newProduct.id,
            locationId: location.id,
            price: 0,
            stock: 0,
            lowStockThreshold: 0,
        });
    });

    saveData(data);
}

export function updateProduct(id, updates) {
    const data = loadData();

    data.products = data.products.map((product) => {
        if (product.id === id) {
            return {
                ...product,
                ...updates,
            };
        }

        return product;
    });

    saveData(data);
}

export function deleteProduct(id) {
    const data = loadData();

    data.products = data.products.filter((product) => product.id !== id);
    data.inventory = data.inventory.filter((row) => row.productId !== id);
    data.cart = data.cart.filter((item) => item.productId !== id);
    data.alerts = data.alerts.filter((alert) => alert.productId !== id);

    saveData(data);
    notifyCartUpdated();
}

/* =========================================================
   SELECTED LOCATION FUNCTIONS
========================================================= */

export function getSelectedLocationId() {
    if (!isBrowser()) return null;
    return localStorage.getItem("selected-location-id");
}

export function setSelectedLocationId(id) {
    if (!isBrowser()) return;
    localStorage.setItem("selected-location-id", String(id));
}

export function detectNearestLocation(latitude, longitude) {
    const locations = getLocations();

    if (!locations.length) return null;

    return locations
        .map((location) => ({
            ...location,
            distance: haversineDistanceKm(
                latitude,
                longitude,
                location.latitude,
                location.longitude
            ),
        }))
        .sort((a, b) => a.distance - b.distance)[0];
}

/* =========================================================
   INVENTORY AND LOCATION-BASED PRODUCT FUNCTIONS
========================================================= */

export function getProductsForLocation(locationId) {
    const data = loadData();

    return data.inventory
        .filter((row) => row.locationId === Number(locationId) && row.stock > 0)
        .map((row) => {
            const product = data.products.find((item) => item.id === row.productId);
            const location = data.locations.find((item) => item.id === row.locationId);

            return {
                productId: row.productId,
                locationId: row.locationId,
                locationName: location?.name || "Unknown location",
                name: product?.name || "Unknown product",
                brand: product?.brand || "",
                category: product?.category || "",
                description: product?.description || "",
                price: row.price,
                stock: row.stock,
                lowStockThreshold: row.lowStockThreshold,
            };
        });
}

export function getInventoryRows() {
    const data = loadData();

    return data.inventory.map((row) => {
        const product = data.products.find((item) => item.id === row.productId);
        const location = data.locations.find((item) => item.id === row.locationId);

        return {
            ...row,
            productName: product?.name || "Deleted product",
            locationName: location?.name || "Deleted location",
        };
    });
}

export function updateInventoryRow(productId, locationId, updates) {
    const data = loadData();

    data.inventory = data.inventory.map((row) => {
        if (row.productId === productId && row.locationId === locationId) {
            return {
                ...row,
                ...updates,
            };
        }

        return row;
    });

    refreshAlertsForInventory(data);
    saveData(data);
}

/* =========================================================
   CART FUNCTIONS
========================================================= */

export function addToCart(productId, locationId) {
    const data = loadData();

    const inventoryRow = data.inventory.find(
        (row) => row.productId === productId && row.locationId === locationId
    );

    if (!inventoryRow || inventoryRow.stock <= 0) {
        return {
            success: false,
            message: "This product is out of stock.",
        };
    }

    const existingItem = data.cart.find(
        (item) => item.productId === productId && item.locationId === locationId
    );

    if (existingItem) {
        if (existingItem.quantity >= inventoryRow.stock) {
            return {
                success: false,
                message: "You cannot add more than available stock.",
            };
        }

        existingItem.quantity += 1;
    } else {
        data.cart.push({
            productId,
            locationId,
            quantity: 1,
        });
    }

    saveData(data);
    notifyCartUpdated();

    return {
        success: true,
        message: "Product added to cart.",
    };
}

export function getCartItems() {
    const data = loadData();

    return data.cart.map((cartItem) => {
        const product = data.products.find((item) => item.id === cartItem.productId);
        const location = data.locations.find((item) => item.id === cartItem.locationId);

        const inventoryRow = data.inventory.find(
            (item) =>
                item.productId === cartItem.productId &&
                item.locationId === cartItem.locationId
        );

        return {
            ...cartItem,
            name: product?.name || "Unknown product",
            brand: product?.brand || "",
            category: product?.category || "",
            locationName: location?.name || "Unknown location",
            price: inventoryRow?.price || 0,
            stock: inventoryRow?.stock || 0,
        };
    });
}

export function updateCartQuantity(productId, locationId, quantity) {
    const data = loadData();

    const inventoryRow = data.inventory.find(
        (row) => row.productId === productId && row.locationId === locationId
    );

    const safeQuantity = Math.max(1, Math.min(quantity, inventoryRow?.stock || 1));

    data.cart = data.cart.map((item) => {
        if (item.productId === productId && item.locationId === locationId) {
            return {
                ...item,
                quantity: safeQuantity,
            };
        }

        return item;
    });

    saveData(data);
    notifyCartUpdated();
}

export function removeFromCart(productId, locationId) {
    const data = loadData();

    data.cart = data.cart.filter(
        (item) => !(item.productId === productId && item.locationId === locationId)
    );

    saveData(data);
    notifyCartUpdated();
}

export function clearCart() {
    const data = loadData();

    data.cart = [];

    saveData(data);
    notifyCartUpdated();
}

export function getCartTotal() {
    return getCartItems().reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

/* =========================================================
   ORDER FUNCTIONS
========================================================= */

export function placeOrder(customer) {
    const data = loadData();

    if (data.cart.length === 0) {
        return {
            success: false,
            message: "Cart is empty.",
        };
    }

    for (const item of data.cart) {
        const inventoryRow = data.inventory.find(
            (row) => row.productId === item.productId && row.locationId === item.locationId
        );

        if (!inventoryRow || inventoryRow.stock < item.quantity) {
            return {
                success: false,
                message: "One or more products no longer have enough stock.",
            };
        }
    }

    const fullCart = data.cart.map((cartItem) => {
        const product = data.products.find((item) => item.id === cartItem.productId);
        const location = data.locations.find((item) => item.id === cartItem.locationId);

        const inventoryRow = data.inventory.find(
            (item) =>
                item.productId === cartItem.productId &&
                item.locationId === cartItem.locationId
        );

        return {
            ...cartItem,
            name: product?.name || "Unknown product",
            brand: product?.brand || "",
            category: product?.category || "",
            locationName: location?.name || "Unknown location",
            price: inventoryRow?.price || 0,
            stock: inventoryRow?.stock || 0,
        };
    });

    const total = fullCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const order = {
        id: nextId(data.orders),
        userId: data.currentUser?.id || null,
        customer,
        items: fullCart,
        total,
        status: "Pending",
        createdAt: new Date().toISOString(),
    };

    data.orders.push(order);

    data.cart.forEach((item) => {
        const inventoryRow = data.inventory.find(
            (row) => row.productId === item.productId && row.locationId === item.locationId
        );

        if (!inventoryRow) return;

        inventoryRow.stock -= item.quantity;

        if (inventoryRow.stock <= inventoryRow.lowStockThreshold) {
            buildLowStockAlert(data, inventoryRow);
        }
    });

    data.cart = [];

    saveData(data);
    notifyCartUpdated();

    return {
        success: true,
        message: "Order placed successfully.",
        order,
    };
}

export function getOrders() {
    return loadData().orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

export function getOrdersForCurrentUser() {
    const data = loadData();

    if (!data.currentUser) return [];

    return data.orders
        .filter((order) => order.userId === data.currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function updateOrderStatus(orderId, status) {
    const data = loadData();

    data.orders = data.orders.map((order) => {
        if (order.id === orderId) {
            return {
                ...order,
                status,
            };
        }

        return order;
    });

    saveData(data);
}

/* =========================================================
   LOW-STOCK ALERT FUNCTIONS
========================================================= */

export function getLowStockAlerts() {
    const data = loadData();

    refreshAlertsForInventory(data);
    saveData(data);

    return data.alerts
        .filter((alert) => alert.status === "Active")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function resolveAlert(alertId) {
    const data = loadData();

    data.alerts = data.alerts.map((alert) => {
        if (alert.id === alertId) {
            return {
                ...alert,
                status: "Resolved",
                resolvedAt: new Date().toISOString(),
            };
        }

        return alert;
    });

    saveData(data);
}

export function restockFromAlert(alertId, quantity) {
    const data = loadData();

    const alert = data.alerts.find((item) => item.id === alertId);

    if (!alert) return;

    data.inventory = data.inventory.map((row) => {
        if (row.productId === alert.productId && row.locationId === alert.locationId) {
            return {
                ...row,
                stock: row.stock + quantity,
            };
        }

        return row;
    });

    data.alerts = data.alerts.map((item) => {
        if (item.id === alertId) {
            return {
                ...item,
                status: "Resolved",
                resolvedAt: new Date().toISOString(),
            };
        }

        return item;
    });

    saveData(data);
}

/* =========================================================
   ADMIN DASHBOARD STATS
========================================================= */

export function getAdminStats() {
    const data = loadData();

    refreshAlertsForInventory(data);
    saveData(data);

    return {
        products: data.products.length,
        locations: data.locations.length,
        orders: data.orders.length,
        lowStockAlerts: data.alerts.filter((alert) => alert.status === "Active").length,
    };
}