"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartItems, getCurrentUser, logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";

export default function Navbar() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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

  function openLoginModal() {
    setMenuOpen(false);
    setLoginModalOpen(true);
  }

  function handleLogout() {
    logoutUser();
    window.dispatchEvent(new Event("authChanged"));
    setMenuOpen(false);
    router.push("/");
  }

  return (
      <>
        <header className="navbar">
          <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brandLogo">LG</span>
            <span>LocalGadget</span>
          </Link>

          {user && (
              <Link
                  href="/tracking"
                  onClick={() => setMenuOpen(false)}
                  aria-current={getCurrentPage("/tracking")}
              >
                Track order
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
            ☰
          </button>

          {user ? (
              <>
                <span className="userBadge">Hi, {user.fullName.split(" ")[0]}</span>
                <button className="navButton" onClick={handleLogout}>
                  Logout
                </button>
              </>
          ) : (
              <Link
                  href="/login"
                  className="navButton"
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname.startsWith("/login") ? "page" : undefined}
              >
                Sign in
              </Link>
          )}
        </nav>
      </header>
  );
}