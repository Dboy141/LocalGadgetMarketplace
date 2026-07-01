"use client";

import { useEffect, useState } from "react";
import { getLowStockAlerts, resolveAlert, restockFromAlert } from "@/lib/api";

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [message, setMessage] = useState("");

  function refresh() {
    const activeAlerts = getLowStockAlerts();
    setAlerts(activeAlerts);
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleAmountChange(alertId, value) {
    setRestockAmounts({
      ...restockAmounts,
      [alertId]: value,
    });
  }

  function handleResolve(alertId) {
    resolveAlert(alertId);
    setMessage("Alert marked as resolved.");
    refresh();
  }

  function handleRestock(alertId) {
    const quantity = Number(restockAmounts[alertId]);

    if (!quantity || quantity <= 0) {
      setMessage("Please enter a valid restock amount.");
      return;
    }

    restockFromAlert(alertId, quantity);
    setRestockAmounts({
      ...restockAmounts,
      [alertId]: "",
    });

    setMessage(`Stock increased by ${quantity}.`);
    refresh();
  }

  return (
      <main className="page">
        <div className="pageHeader">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Low-Stock Alerts</h1>
            <p className="muted">
              Review products that have reached their low-stock threshold and
              restock them with your own custom amount.
            </p>
          </div>
        </div>

        {message && <p className="successMessage">{message}</p>}

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

                    <p>
                      <strong>Location:</strong> {alert.locationName}
                    </p>

                    <p>
                      <strong>Current stock:</strong> {alert.stock}
                    </p>

                    <p>
                      <strong>Low-stock threshold:</strong>{" "}
                      {alert.lowStockThreshold}
                    </p>

                    <p className="muted">
                      Created: {new Date(alert.createdAt).toLocaleString()}
                    </p>

                    <div className="restockBox">
                      <label>
                        Restock amount
                        <input
                            type="number"
                            min="1"
                            value={restockAmounts[alert.id] || ""}
                            onChange={(e) =>
                                handleAmountChange(alert.id, e.target.value)
                            }
                            placeholder="Example: 15"
                        />
                      </label>
                    </div>

                    <div className="buttonRow">
                      <button
                          className="primaryButton"
                          onClick={() => handleRestock(alert.id)}
                      >
                        Restock
                      </button>

                      <button
                          className="secondaryButton"
                          onClick={() => handleResolve(alert.id)}
                      >
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