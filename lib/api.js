"use client";

import { seedData } from "./seedData";

const STORAGE_KEY = "local-gadget-marketplace-data";
const MOCK_OTP_CODE = "123456";
const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Ready for pickup",
    "Completed",
    "Cancelled",
];
const PRODUCT_IMAGE_BY_ID = {
    1: "/images/products/samsung-galaxy-a55.jpg",
    2: "/images/products/iphone-13.png",
    3: "/images/products/sony-wh-1000xm4.jpg",
    4: "/images/products/logitech-mx-master-3s.webp",
    5: "/images/products/lenovo-ideapad-slim-5.png",
    6: "/images/products/anker-20000mah-power-bank.jpg",
};

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

function cleanText(value) {
    return String(value || "").trim();
}

function isValidPhone(phone) {
    return /^\+?[0-9\s-]{7,18}$/.test(cleanText(phone));
}

function isFiniteNumber(value) {
    return Number.isFinite(Number(value));
}

function normalizeNonNegativeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function getProductImage(product) {
    if (!product) return "";
    return product.image || PRODUCT_IMAGE_BY_ID[product.id] || "";
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

export function signInWithGoogle() {
    const data = loadData();
    const googleProfile = {
        fullName: "Daniel Obe",
        email: "daniel.obe@gmail.com",
        phone: "+36 20 123 4567",
        role: "user",
        provider: "google",
    };

    let user = data.users.find(
        (item) => item.email.toLowerCase() === googleProfile.email.toLowerCase()
    );

    if (!user) {
        user = {
            id: nextId(data.users),
            ...googleProfile,
        };

        data.users.push(user);
    }

    data.currentUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || googleProfile.phone,
        role: user.role,
        provider: user.provider || "google",
    };

    saveData(data);
    notifyAuthChanged();

    return {
        success: true,
        message: "Signed in with Google.",
        user: data.currentUser,
    };
}

export function requestPhoneOtp(phone) {
    if (!cleanText(phone)) {
        return {
            success: false,
            message: "Enter your phone number to continue.",
        };
    }

    if (!isValidPhone(phone)) {
        return {
            success: false,
            message: "Enter a valid phone number.",
        };
    }

    return {
        success: true,
        message: `Verification code sent. Use ${MOCK_OTP_CODE} for this demo.`,
    };
}

export function verifyPhoneOtp(phone, otp) {
    const data = loadData();
    const normalizedPhone = cleanText(phone);

    if (!isValidPhone(normalizedPhone)) {
        return {
            success: false,
            message: "Enter a valid phone number.",
        };
    }

    if (!/^\d{6}$/.test(cleanText(otp))) {
        return {
            success: false,
            message: "Enter the 6-digit verification code.",
        };
    }

    if (cleanText(otp) !== MOCK_OTP_CODE) {
        return {
            success: false,
            message: "Invalid verification code.",
        };
    }

    let user = data.users.find((item) => item.phone === normalizedPhone);

    if (!user) {
        user = {
            id: nextId(data.users),
            fullName: "Daniel Obe",
            email: "daniel.obe@gmail.com",
            phone: normalizedPhone,
            role: "user",
            provider: "phone",
        };

        data.users.push(user);
    }

    user.role = "user";
    user.provider = "phone";

    data.currentUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || normalizedPhone,
        role: "user",
        provider: "phone",
    };

    saveData(data);
    notifyAuthChanged();

    return {
        success: true,
        message: "Phone verified.",
        user: data.currentUser,
    };
}

export function switchDemoRole(role) {
    const data = loadData();

    if (!["user", "admin"].includes(role)) {
        return {
            success: false,
            message: "Choose a valid demo role.",
        };
    }

    if (!data.currentUser) {
        return {
            success: false,
            message: "Sign in before switching roles.",
        };
    }

    if (data.currentUser.provider !== "phone") {
        return {
            success: false,
            message: "Demo role switching is available for phone sign-in.",
        };
    }

    data.currentUser = {
        ...data.currentUser,
        role,
    };

    data.users = data.users.map((user) => {
        if (user.id === data.currentUser.id) {
            return {
                ...user,
                role,
                provider: "phone",
            };
        }

        return user;
    });

    saveData(data);
    notifyAuthChanged();

    return {
        success: true,
        message: `Switched to ${role} view.`,
        user: data.currentUser,
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
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (!cleanText(location.name) || !cleanText(location.city) || !cleanText(location.address)) {
        return {
            success: false,
            message: "Fill in the location name, city, and address.",
        };
    }

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        return {
            success: false,
            message: "Latitude must be a number between -90 and 90.",
        };
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        return {
            success: false,
            message: "Longitude must be a number between -180 and 180.",
        };
    }

    const exists = data.locations.some(
        (item) =>
            item.name.toLowerCase() === cleanText(location.name).toLowerCase() &&
            item.city.toLowerCase() === cleanText(location.city).toLowerCase()
    );

    if (exists) {
        return {
            success: false,
            message: "A location with this name already exists in that city.",
        };
    }

    const newLocation = {
        id: nextId(data.locations),
        ...location,
        name: cleanText(location.name),
        city: cleanText(location.city),
        address: cleanText(location.address),
        latitude,
        longitude,
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

    return {
        success: true,
        message: "Location added.",
    };
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
    const name = cleanText(product.name);
    const brand = cleanText(product.brand);
    const category = cleanText(product.category);
    const description = cleanText(product.description);

    if (!name || !brand || !category || !description) {
        return {
            success: false,
            message: "Fill in all product fields.",
        };
    }

    if (name.length < 2 || brand.length < 2 || category.length < 2) {
        return {
            success: false,
            message: "Name, brand, and category must be at least 2 characters.",
        };
    }

    const exists = data.products.some(
        (item) =>
            item.name.toLowerCase() === name.toLowerCase() &&
            item.brand.toLowerCase() === brand.toLowerCase()
    );

    if (exists) {
        return {
            success: false,
            message: "This product already exists.",
        };
    }

    const newProduct = {
        id: nextId(data.products),
        ...product,
        name,
        brand,
        category,
        description,
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

    return {
        success: true,
        message: "Product added.",
    };
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
                image: getProductImage(product),
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
    const numericUpdates = {};

    for (const [field, value] of Object.entries(updates)) {
        if (!isFiniteNumber(value)) {
            return {
                success: false,
                message: "Inventory values must be valid numbers.",
            };
        }

        numericUpdates[field] = normalizeNonNegativeNumber(value);
    }

    data.inventory = data.inventory.map((row) => {
        if (row.productId === productId && row.locationId === locationId) {
            return {
                ...row,
                ...numericUpdates,
            };
        }

        return row;
    });

    refreshAlertsForInventory(data);
    saveData(data);

    return {
        success: true,
        message: "Inventory updated.",
    };
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
            image: getProductImage(product),
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

    if (!Number.isFinite(Number(quantity))) {
        return {
            success: false,
            message: "Enter a valid quantity.",
        };
    }

    const safeQuantity = Math.max(1, Math.min(Number(quantity), inventoryRow?.stock || 1));

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

    return {
        success: true,
        message: "Cart updated.",
    };
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
    const orderCustomer = customer || data.currentUser;

    if (!orderCustomer) {
        return {
            success: false,
            message: "Sign in before placing your order.",
        };
    }

    if (orderCustomer.phone && !isValidPhone(orderCustomer.phone)) {
        return {
            success: false,
            message: "Your saved phone number is invalid.",
        };
    }

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
        customer: orderCustomer,
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

    if (!ORDER_STATUSES.includes(status)) {
        return {
            success: false,
            message: "Choose a valid order status.",
        };
    }

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

    return {
        success: true,
        message: "Order status updated.",
    };
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
