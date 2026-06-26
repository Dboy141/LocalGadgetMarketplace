"use client";

import { useEffect, useState } from "react";
import {
  getInventoryRows,
  updateInventoryRow,
} from "@/lib/api";

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
    <main className="page" id="main-content">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Inventory Management</h1>
        </div>
      </div>

      <div className="tableCard">
        <h2>Stock, Price and Threshold by Location</h2>

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
                      aria-label={`Price for ${row.productName} at ${row.locationName}`}
                      type="number"
                      value={row.price}
                      onChange={(e) => handleChange(row, "price", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="tableInput"
                      aria-label={`Stock for ${row.productName} at ${row.locationName}`}
                      type="number"
                      value={row.stock}
                      onChange={(e) => handleChange(row, "stock", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="tableInput"
                      aria-label={`Low-stock threshold for ${row.productName} at ${row.locationName}`}
                      type="number"
                      value={row.lowStockThreshold}
                      onChange={(e) => handleChange(row, "lowStockThreshold", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
