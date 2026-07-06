"use client";

import { useEffect, useState } from "react";
import {
  getCartItems,
  getCartTotal,
  getCurrentUser,
  placeOrder,
  signInWithGoogle,
} from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCart(getCartItems());

    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  function handleGoogleSignIn() {
    const result = signInWithGoogle();
    setCurrentUser(result.user);
    setHasError(false);
    setMessage("");
    window.dispatchEvent(new Event("authChanged"));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!currentUser) {
      setHasError(true);
      setMessage("Continue with Google so we can save and track this order.");
      return;
    }

    const result = placeOrder();

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setHasError(false);
    setMessage("Order placed successfully.");
    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/tracking");
  }

  return (
      <main className="page narrowPage" id="main-content">
        <div className="formCard">
          <p className="eyebrow">No payment gateway yet</p>
          <h1>Checkout</h1>

          <p className="muted">
            {currentUser
                ? "You are signed in, so your saved account details will be used for this order."
                : "Continue with Google so we can attach the order to you and save it to your tracking page."}
          </p>

          {cart.length === 0 ? (
              <div className="emptyState smallEmptyState">
                <h2>Your cart is empty.</h2>
                <p>Add products before checking out.</p>
              </div>
          ) : (
              <>
                <div className="checkoutSummary">
                  {cart.map((item) => (
                      <div
                          className="summaryRow"
                          key={`${item.productId}-${item.locationId}`}
                      >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                        <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
                      </div>
                  ))}

                  <div className="summaryRow totalLine">
                    <span>Total</span>
                    <strong className="priceHighlight">
                      €{getCartTotal().toFixed(2)}
                    </strong>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="form">
                  {!currentUser && (
                      <div className="checkoutGooglePrompt">
                        <p>
                          Continue with Google so we can save this order to your history.
                        </p>
                        <button
                            className="googleButton fullButton"
                            type="button"
                            onClick={handleGoogleSignIn}
                        >
                          <span className="googleMark" aria-hidden="true">G</span>
                          Continue with Google
                        </button>
                      </div>
                  )}

                  {currentUser && (
                      <>
                        <div className="signedInCheckout">
                          <span className="googleMark" aria-hidden="true">G</span>
                          <div>
                            <strong>{currentUser.fullName}</strong>
                            <p>
                              {currentUser.email}
                              {currentUser.phone ? ` / ${currentUser.phone}` : ""}
                            </p>
                          </div>
                        </div>

                        <button className="primaryButton" type="submit">
                          Place Order
                        </button>
                      </>
                  )}

                  {message && (
                      <p className={hasError ? "errorMessage" : "successMessage"}>
                        {message}
                      </p>
                  )}
                </form>
              </>
          )}
        </div>
      </main>
  );
}
