"use client";

import { useEffect, useState } from "react";
import { getCartItems, getCartTotal, placeOrder } from "@/lib/api";
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

  useEffect(() => {
    setCart(getCartItems());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const result = placeOrder(form);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage("Order placed successfully.");
    router.push("/orders");
  }

  return (
    <main className="page narrowPage">
      <div className="formCard">
        <p className="eyebrow">No payment gateway yet</p>
        <h1>Checkout</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="checkoutSummary">
              {cart.map((item) => (
                <div className="summaryRow" key={`${item.productId}-${item.locationId}`}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
              <div className="summaryRow totalLine">
                <span>Total</span>
                <strong>€{getCartTotal().toFixed(2)}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <label>
                Full name
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </label>

              <button className="primaryButton" type="submit">Place Order</button>
              {message && <p className="message">{message}</p>}
            </form>
          </>
        )}
      </div>
    </main>
  );
}
