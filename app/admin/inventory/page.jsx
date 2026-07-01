"use client";

import { useEffect, useState } from "react";
import { getInventoryRows, updateInventoryRow } from "@/lib/api";

export default function AdminInventoryPage() {
  const [rows, setRows] = useState([]);

  function refresh() {
    setRows(getInventoryRows());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleChange(row, field, value) {
    const numericValue = Number(value);

    updateInventoryRow(row.productId, row.locationId, {
      [field]: numericValue,
    });

    refresh();
  }

  return (
      <main className="page">
        <div className="pageHeader">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Inventory Management</h1>
            <p className="muted">
              Control product pricing, available stock, and low-stock warning
              levels for each product at each location.
            </p>
          </div>
        </div>

        <div className="tableCard">
          <h2>Price, Stock and Low-Stock Threshold per Product Location</h2>

          <p className="muted">
            Each product can have a different price, stock quantity, and low-stock
            threshold depending on the selected location.
          </p>

          <div className="responsiveTable">
            <table>
              <thead>
              <tr>
                <th>Product</th>
                <th>Location</th>
                <th>Price (€)</th>
                <th>Stock</th>
                <th>Low-stock threshold</th>
              </tr>
              </thead>

              <tbody>
              {rows.map((row) => (
                  <tr key={`${row.productId}-${row.locationId}`}>
                    <td>{row.productName}</td>
                    <td>{row.locationName}</td>

                    <td>
                      <input
                          className="tableInput"
                          type="number"
                          min="0"
                          value={row.price}
                          onChange={(e) =>
                              handleChange(row, "price", e.target.value)
                          }
                      />
                    </td>

                    <td>
                      <input
                          className="tableInput"
                          type="number"
                          min="0"
                          value={row.stock}
                          onChange={(e) =>
                              handleChange(row, "stock", e.target.value)
                          }
                      />
                    </td>

                    <td>
                      <input
                          className="tableInput"
                          type="number"
                          min="0"
                          value={row.lowStockThreshold}
                          onChange={(e) =>
                              handleChange(row, "lowStockThreshold", e.target.value)
                          }
                      />
                    </td>
                  </tr>
              ))}

              {rows.length === 0 && (
                  <tr>
                    <td colSpan="5">No inventory rows available yet.</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
}