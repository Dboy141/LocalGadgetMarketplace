export const seedData = {
  users: [
    {
      id: 1,
      fullName: "Test User",
      email: "user@test.com",
      password: "password123",
      phone: "+36 20 123 4567",
      role: "user",
    },
    {
      id: 2,
      fullName: "Admin User",
      email: "admin@test.com",
      password: "admin123",
      phone: "+36 20 000 0000",
      role: "admin",
    },
  ],

  locations: [
    {
      id: 1,
      name: "Debrecen Main Store",
      city: "Debrecen",
      address: "Piac utca 10",
      latitude: 47.5316,
      longitude: 21.6273,
    },
    {
      id: 2,
      name: "Budapest Tech Hub",
      city: "Budapest",
      address: "Váci utca 20",
      latitude: 47.4979,
      longitude: 19.0402,
    },
    {
      id: 3,
      name: "Szeged Pickup Point",
      city: "Szeged",
      address: "Kárász utca 5",
      latitude: 46.253,
      longitude: 20.1414,
    },
  ],

  products: [
    {
      id: 1,
      name: "Samsung Galaxy A55",
      brand: "Samsung",
      category: "Smartphone",
      image: "/images/products/samsung-galaxy-a55.jpg",
      description:
          "Reliable mid-range phone with strong battery life and a clean display.",
    },
    {
      id: 2,
      name: "iPhone 13",
      brand: "Apple",
      category: "Smartphone",
      image: "/images/products/iphone-13.png",
      description:
          "Compact iPhone with excellent camera quality and smooth performance.",
    },
    {
      id: 3,
      name: "Sony WH-1000XM4",
      brand: "Sony",
      category: "Headphones",
      image: "/images/products/sony-wh-1000xm4.jpg",
      description:
          "Noise cancelling wireless headphones for travel, study and work.",
    },
    {
      id: 4,
      name: "Logitech MX Master 3S",
      brand: "Logitech",
      category: "Accessories",
      image: "/images/products/logitech-mx-master-3s.webp",
      description:
          "Premium wireless mouse for productivity and creative workflows.",
    },
    {
      id: 5,
      name: "Lenovo IdeaPad Slim 5",
      brand: "Lenovo",
      category: "Laptop",
      image: "/images/products/lenovo-ideapad-slim-5.png",
      description:
          "Lightweight laptop for school, coding, business and everyday work.",
    },
    {
      id: 6,
      name: "Anker 20,000mAh Power Bank",
      brand: "Anker",
      category: "Power",
      image: "/images/products/anker-20000mah-power-bank.jpg",
      description:
          "High-capacity power bank for phones, tablets and travel.",
    },
  ],

  inventory: [
    { productId: 1, locationId: 1, price: 389, stock: 6, lowStockThreshold: 3 },
    { productId: 2, locationId: 1, price: 499, stock: 2, lowStockThreshold: 2 },
    { productId: 3, locationId: 1, price: 219, stock: 5, lowStockThreshold: 2 },
    { productId: 4, locationId: 1, price: 99, stock: 10, lowStockThreshold: 4 },
    { productId: 5, locationId: 1, price: 749, stock: 3, lowStockThreshold: 2 },
    { productId: 6, locationId: 1, price: 49, stock: 12, lowStockThreshold: 5 },

    { productId: 1, locationId: 2, price: 399, stock: 8, lowStockThreshold: 3 },
    { productId: 2, locationId: 2, price: 515, stock: 4, lowStockThreshold: 2 },
    { productId: 3, locationId: 2, price: 229, stock: 1, lowStockThreshold: 2 },
    { productId: 4, locationId: 2, price: 95, stock: 7, lowStockThreshold: 4 },
    { productId: 5, locationId: 2, price: 729, stock: 5, lowStockThreshold: 2 },
    { productId: 6, locationId: 2, price: 45, stock: 9, lowStockThreshold: 5 },

    { productId: 1, locationId: 3, price: 379, stock: 3, lowStockThreshold: 3 },
    { productId: 3, locationId: 3, price: 215, stock: 6, lowStockThreshold: 2 },
    { productId: 4, locationId: 3, price: 92, stock: 3, lowStockThreshold: 4 },
    { productId: 6, locationId: 3, price: 42, stock: 8, lowStockThreshold: 5 },
  ],

  orders: [],
  alerts: [],
  cart: [],
  currentUser: null,
};
