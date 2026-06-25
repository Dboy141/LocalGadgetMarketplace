"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getCurrentUser } from "@/lib/api";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();

        if (!user) {
            router.push("/login");
            return;
        }

        if (user.role !== "admin") {
            router.push("/");
            return;
        }

        setAllowed(true);
        setChecking(false);
    }, [router]);

    if (checking) {
        return (
            <main className="page">
                <div className="emptyState">
                    <h2>Checking admin access...</h2>
                    <p>Please wait while we confirm your permissions.</p>
                </div>
            </main>
        );
    }

    if (!allowed) {
        return null;
    }

    return (
        <div className="adminLayout">
            <AdminSidebar />
            <div className="adminContent">{children}</div>
        </div>
    );
}