"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, switchDemoRole } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DemoRoleToggle() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  function refreshUser() {
    const currentUser = getCurrentUser();
    setUser(currentUser?.provider === "phone" ? currentUser : null);
  }

  useEffect(() => {
    refreshUser();
    window.addEventListener("authChanged", refreshUser);

    return () => {
      window.removeEventListener("authChanged", refreshUser);
    };
  }, []);

  function handleRoleChange(role) {
    const result = switchDemoRole(role);

    if (!result.success) return;

    setUser(result.user);
    router.push(role === "admin" ? "/admin" : "/");
  }

  if (!user) return null;

  return (
    <div className="demoRoleToggle" aria-label="Demo view switcher">
      <span>View</span>
      <button
        type="button"
        className={user.role === "user" ? "activeDemoRole" : ""}
        onClick={() => handleRoleChange("user")}
        aria-pressed={user.role === "user"}
      >
        User
      </button>
      <button
        type="button"
        className={user.role === "admin" ? "activeDemoRole" : ""}
        onClick={() => handleRoleChange("admin")}
        aria-pressed={user.role === "admin"}
      >
        Admin
      </button>
    </div>
  );
}
