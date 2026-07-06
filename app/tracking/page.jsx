"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, getOrdersForCurrentUser } from "@/lib/api";

const trackingSteps = ["Pending", "Confirmed", "Ready for pickup", "Completed"];

function getStepState(orderStatus, step) {
  if (orderStatus === "Cancelled") return "inactive";

  const currentIndex = trackingSteps.indexOf(orderStatus);
  const stepIndex = trackingSteps.indexOf(step);

  if (currentIndex === -1) return step === "Pending" ? "active" : "inactive";
  if (stepIndex < currentIndex) return "complete";
  if (stepIndex === currentIndex) return "active";
  return "inactive";
}

export default function TrackingPage() {
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
          <h2>Sign in to track your order.</h2>
          <p>Use Google so we can show the orders connected to your account.</p>
          <Link href="/login" className="primaryButton">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const latestOrder = orders[0];

  return (
    <main className="page" id="main-content">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Order tracking</p>
          <h1>Track Your Orders</h1>
          <p className="muted">Signed in as {user.fullName}.</p>
        </div>
        <Link href="/" className="secondaryButton">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="emptyState">
          <h2>No tracked orders yet.</h2>
          <p>Place an order from your cart and it will appear here.</p>
          <Link href="/" className="primaryButton">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="trackingLayout">
          <section className="trackingHero">
            <div>
              <p className="eyebrow">Latest order</p>
              <h2>Order #{latestOrder.id}</h2>
              <p className="muted">
                Placed {new Date(latestOrder.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`statusPill ${
                latestOrder.status === "Cancelled" ? "critical" : ""
              }`}
            >
              {latestOrder.status}
            </span>
          </section>

          <section className="trackingCard">
            <h2>Progress</h2>
            {latestOrder.status === "Cancelled" ? (
              <div className="emptyState smallEmptyState">
                <h2>Order cancelled.</h2>
                <p>Contact the store if you need help with this order.</p>
              </div>
            ) : (
              <ol className="trackingSteps">
                {trackingSteps.map((step) => (
                  <li className={getStepState(latestOrder.status, step)} key={step}>
                    <span aria-hidden="true" />
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="trackingCard">
            <h2>Order details</h2>
            <div className="summaryRow">
              <span>Contact</span>
              <strong>{latestOrder.customer.phone || "Saved account"}</strong>
            </div>
            <div className="summaryRow">
              <span>Total</span>
              <strong className="priceHighlight">
                €{latestOrder.total.toFixed(2)}
              </strong>
            </div>
            <div className="miniTable">
              {latestOrder.items.map((item) => (
                <div
                  className="miniRow"
                  key={`${latestOrder.id}-${item.productId}-${item.locationId}`}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>{item.locationName}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="trackingCard">
            <h2>Previous orders</h2>
            <div className="orderList">
              {orders.slice(1).map((order) => (
                <div className="trackingOrderRow" key={order.id}>
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="statusPill">{order.status}</span>
                </div>
              ))}
              {orders.length === 1 && (
                <p className="muted">Older orders will appear here.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
