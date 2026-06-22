"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  function refresh() {
    setOrders(getOrders());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleStatusChange(orderId, status) {
    updateOrderStatus(orderId, status);
    refresh();
  }

  return (
    <main className="page">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Orders</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="emptyState">
          <h2>No orders yet.</h2>
        </div>
      ) : (
        <div className="orderList">
          {orders.map((order) => (
            <div className="orderCard" key={order.id}>
              <div className="orderTop">
                <h2>Order #{order.id}</h2>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Ready for pickup">Ready for pickup</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Customer:</strong> {order.customer.fullName}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Total:</strong> €{order.total.toFixed(2)}</p>

              <div className="miniTable">
                {order.items.map((item) => (
                  <div className="miniRow" key={`${order.id}-${item.productId}`}>
                    <span>{item.name} × {item.quantity}</span>
                    <strong>{item.locationName}</strong>
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
