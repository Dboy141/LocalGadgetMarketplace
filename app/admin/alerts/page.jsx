"use client";

import { useEffect, useState } from "react";
import { getLowStockAlerts, resolveAlert, restockFromAlert } from "@/lib/api";

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState([]);

  function refresh() {
    setAlerts(getLowStockAlerts());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleResolve(alertId) {
    resolveAlert(alertId);
    refresh();
  }

  function handleRestock(alertId) {
    restockFromAlert(alertId, 10);
    refresh();
  }

  return (
    <main className="page">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Low-Stock Alerts</h1>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="emptyState">
          <h2>No active low-stock alerts.</h2>
          <p>Alerts will appear here when stock reaches the threshold.</p>
        </div>
      ) : (
        <div className="alertGrid">
          {alerts.map((alert) => (
            <div className="alertCard" key={alert.id}>
              <span className="statusPill warning">Low stock</span>
              <h2>{alert.productName}</h2>
              <p><strong>Location:</strong> {alert.locationName}</p>
              <p><strong>Current stock:</strong> {alert.stock}</p>
              <p><strong>Threshold:</strong> {alert.lowStockThreshold}</p>
              <p className="muted">{new Date(alert.createdAt).toLocaleString()}</p>

              <div className="buttonRow">
                <button className="primaryButton" onClick={() => handleRestock(alert.id)}>
                  Restock +10
                </button>
                <button className="secondaryButton" onClick={() => handleResolve(alert.id)}>
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
