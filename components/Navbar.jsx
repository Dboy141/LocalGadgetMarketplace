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
  const [menuOpen, setMenuOpen] = useState(false);

  function getCurrentPage(href) {
    return pathname === href ? "page" : undefined;
  }

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
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
        >
          ☰
        </button>

        <nav
            className={`navLinks ${menuOpen ? "navLinksOpen" : ""}`}
            id="primary-navigation"
            aria-label="Primary navigation"
        >
          <Link href="/" onClick={() => setMenuOpen(false)} aria-current={getCurrentPage("/")}>
            Shop
          </Link>

          {user && (
              <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  aria-current={getCurrentPage("/orders")}
              >
                Orders
              </Link>
          )}

          {user?.role === "admin" && (
              <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname.startsWith("/admin") ? "page" : undefined}
              >
                Admin
              </Link>
          )}

          <Link
              href="/cart"
              className="cartLink"
              onClick={() => setMenuOpen(false)}
              aria-current={getCurrentPage("/cart")}
              aria-label={`Cart with ${cartCount} items`}
          >
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
                <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    aria-current={getCurrentPage("/login")}
                >
                  Login
                </Link>
                <Link
                    href="/signup"
                    className="navButton"
                    onClick={() => setMenuOpen(false)}
                    aria-current={getCurrentPage("/signup")}
                >
                  Sign Up
                </Link>
              </>
          )}
        </nav>
      </header>
  );
}
