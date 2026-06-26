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

  function getAlertSeverity(alert) {
    if (alert.stock === 0 || alert.stock <= Math.floor(alert.lowStockThreshold / 2)) {
      return "critical";
    }

    return "warning";
  }

  return (
    <main className="page" id="main-content">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Low-Stock Alerts</h1>
          <p className="muted">
            Prioritize restocks by current inventory level and store location.
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="emptyState">
          <h2>No active low-stock alerts.</h2>
          <p>Alerts will appear here when stock reaches the threshold.</p>
        </div>
      ) : (
        <div className="alertGrid">
          {alerts.map((alert) => {
            const severity = getAlertSeverity(alert);
            const isCritical = severity === "critical";

            return (
              <article
                className={`alertCard ${isCritical ? "alertCritical" : "alertWarning"}`}
                key={alert.id}
                aria-label={`${isCritical ? "Critical" : "Low-stock"} alert for ${alert.productName}`}
              >
                <div className="alertTop">
                  <span className={`statusPill ${severity}`}>
                    {isCritical ? "Critical" : "Low stock"}
                  </span>
                  <span className="alertTime">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="alertProduct">
                  <div>
                    <h2>{alert.productName}</h2>
                    <p>{alert.locationName}</p>
                  </div>

                  <div className="alertStock">
                    <span>{alert.stock}</span>
                    <small>in stock</small>
                  </div>
                </div>

                <dl className="alertDetails">
                  <div>
                    <dt>Threshold</dt>
                    <dd>{alert.lowStockThreshold}</dd>
                  </div>
                  <div>
                    <dt>Short by</dt>
                    <dd>{Math.max(alert.lowStockThreshold - alert.stock, 0)}</dd>
                  </div>
                </dl>

                <div className="buttonRow alertActions">
                  <button
                    className="primaryButton"
                    onClick={() => handleRestock(alert.id)}
                    aria-label={`Restock ${alert.productName} by 10 units`}
                  >
                    Restock +10
                  </button>
                  <button
                    className="secondaryButton"
                    onClick={() => handleResolve(alert.id)}
                    aria-label={`Mark ${alert.productName} alert resolved`}
                  >
                    Mark Resolved
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
