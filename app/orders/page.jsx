"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getOrdersForCurrentUser } from "@/lib/api";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setOrders(getOrdersForCurrentUser());
  }, []);

  if (!user) {
    return (
        <main className="page" id="main-content">
          <div className="emptyState">
            <h2>Please log in to view your orders.</h2>
            <p>Your order history is connected to your account.</p>
            <Link href="/login" className="primaryButton">
              Login
            </Link>
          </div>
        </main>
    );
  }

  return (
      <main className="page" id="main-content">
        <div className="pageHeader">
          <div>
            <p className="eyebrow">User area</p>
            <h1>Order History</h1>
            <p className="muted">Showing orders for {user.fullName}.</p>
          </div>
        </div>

        {orders.length === 0 ? (
            <div className="emptyState">
              <h2>No orders yet.</h2>
              <p>Place an order from the cart first.</p>
              <Link href="/" className="primaryButton">
                Start Shopping
              </Link>
            </div>
        ) : (
            <div className="orderList">
              {orders.map((order) => (
                  <div className="orderCard" key={order.id}>
                    <div className="orderTop">
                      <h2>Order #{order.id}</h2>
                      <span className="statusPill">{order.status}</span>
                    </div>

                    <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
                    <p>
                      <strong>Customer:</strong> {order.customer.fullName}
                    </p>
                    <p>
                      <strong>Contact:</strong> {order.customer.email} / {order.customer.phone}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      <span className="priceHighlight">€{order.total.toFixed(2)}</span>
                    </p>

                    <div className="miniTable">
                      {order.items.map((item) => (
                          <div className="miniRow" key={`${order.id}-${item.productId}`}>
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                            <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
                          </div>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
        )}
      </main>
  );
}
