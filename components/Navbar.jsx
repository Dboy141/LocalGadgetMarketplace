"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartItems, getCurrentUser, logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function refreshNavbar() {
    const cartItems = getCartItems();
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    setCartCount(totalQuantity);
    setUser(getCurrentUser());
  }

  useEffect(() => {
    refreshNavbar();

    window.addEventListener("cartUpdated", refreshNavbar);
    window.addEventListener("authChanged", refreshNavbar);

    return () => {
      window.removeEventListener("cartUpdated", refreshNavbar);
      window.removeEventListener("authChanged", refreshNavbar);
    };
  }, []);

  function handleLogout() {
    logoutUser();
    window.dispatchEvent(new Event("authChanged"));
    setMenuOpen(false);
    router.push("/login");
  }

  return (
      <header className="navbar">
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brandLogo">LG</span>
          <span>LocalGadget</span>
        </Link>

        <button
            className="mobileMenuButton"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <nav className={`navLinks ${menuOpen ? "navLinksOpen" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>

          {user && (
              <Link href="/orders" onClick={() => setMenuOpen(false)}>
                Orders
              </Link>
          )}

          {user?.role === "admin" && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
          )}

          <Link href="/cart" className="cartLink" onClick={() => setMenuOpen(false)}>
            Cart ({cartCount})
          </Link>

          {user ? (
              <>
                <span className="userBadge">Hi, {user.fullName.split(" ")[0]}</span>
                <button className="navButton" onClick={handleLogout}>
                  Logout
                </button>
              </>
          ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="navButton" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
          )}
        </nav>
      </header>
  );
}