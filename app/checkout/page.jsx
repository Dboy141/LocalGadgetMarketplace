"use client";

import { useEffect, useState } from "react";
import { getCartItems, getCartTotal, getCurrentUser, placeOrder } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCart(getCartItems());

    const user = getCurrentUser();

    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName,
        email: user.email,
      }));
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const result = placeOrder(form);

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setHasError(false);
    setMessage("Order placed successfully.");
    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/orders");
  }

  return (
      <main className="page narrowPage" id="main-content">
        <div className="formCard">
          <p className="eyebrow">No payment gateway yet</p>
          <h1>Checkout</h1>

          <p className="muted">
            We will use these contact details to reach you when your order is ready
            for pickup.
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
                  <label>
                    Full name
                    <input
                        className={hasError ? "inputError" : ""}
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                    />
                  </label>

                  <label>
                    Email
                    <input
                        className={hasError ? "inputError" : ""}
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                  </label>

                  <label>
                    Phone
                    <input
                        className={hasError ? "inputError" : ""}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+36..."
                        required
                    />
                  </label>

                  <button className="primaryButton" type="submit">
                    Place Order
                  </button>

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
