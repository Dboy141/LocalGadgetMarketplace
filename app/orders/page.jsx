"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <main className="page">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">User area</p>
          <h1>Order History</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="emptyState">
          <h2>No orders yet.</h2>
          <p>Place an order from the cart first.</p>
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
              <p><strong>Customer:</strong> {order.customer.fullName}</p>
              <p><strong>Total:</strong> €{order.total.toFixed(2)}</p>

              <div className="miniTable">
                {order.items.map((item) => (
                  <div className="miniRow" key={`${order.id}-${item.productId}`}>
                    <span>{item.name} × {item.quantity}</span>
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
