"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/api";
import StatCard from "@/components/StatCard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getAdminStats());
  }, []);

  if (!stats) {
    return <main className="page"><p>Loading dashboard...</p></main>;
  }

  return (
    <main className="page">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="statsGrid">
        <StatCard label="Products" value={stats.products} />
        <StatCard label="Locations" value={stats.locations} />
        <StatCard label="Orders" value={stats.orders} />
        <StatCard label="Low-stock alerts" value={stats.lowStockAlerts} />
      </div>

      <div className="infoPanel">
        <h2>MVP Admin Focus</h2>
        <p>
          From here, admins can manage products, locations, inventory, low-stock
          alerts, and incoming orders.
        </p>
      </div>
    </main>
  );
}
