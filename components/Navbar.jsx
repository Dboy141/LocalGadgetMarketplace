"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartItems, getCurrentUser, logoutUser } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  function refresh() {
    setCartCount(getCartItems().reduce((sum, item) => sum + item.quantity, 0));
    setUser(getCurrentUser());
  }

  useEffect(() => {
    refresh();

    function handleStorageChange() {
      refresh();
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, [pathname]);

  function handleLogout() {
    logoutUser();
    refresh();
    router.push("/");
  }

  return (
    <header className="navbar">
      <Link href="/" className="brand">
        <span className="brandIcon">LG</span>
        <span>LocalGadget</span>
      </Link>

      <nav className="navLinks">
        <Link href="/">Shop</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/cart" className="cartLink">Cart ({cartCount})</Link>

        {user ? (
          <button className="navButton" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup" className="navButton">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
