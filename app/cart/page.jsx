"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
} from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  function refresh() {
    setCart(getCartItems());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleQuantityChange(productId, locationId, quantity) {
    const result = updateCartQuantity(productId, locationId, Number(quantity));

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage("");
    refresh();
  }

  function handleRemove(productId, locationId) {
    removeFromCart(productId, locationId);
    refresh();
  }

  const total = getCartTotal();

  return (
    <main className="page" id="main-content">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Your cart</p>
          <h1>Cart</h1>
        </div>
        <Link href="/" className="secondaryButton">Continue Shopping</Link>
      </div>

      {cart.length === 0 ? (
        <div className="emptyState">
          <h2>Your cart is empty.</h2>
          <p>Add products from the homepage.</p>
        </div>
      ) : (
        <div className="cartLayout">
          <div className="cartList">
            {message && <p className="errorMessage">{message}</p>}

            {cart.map((item) => (
              <div className="cartItem" key={`${item.productId}-${item.locationId}`}>
                <div className="cartItemImage">
                  {item.image ? (
                    <img src={item.image} alt={item.name} loading="lazy" width="80" height="80" />
                  ) : (
                    <span>{item.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div className="cartItemInfo">
                  <h3>{item.name}</h3>
                  <p className="muted">{item.locationName}</p>
                  <p>€{item.price.toFixed(2)} each</p>
                </div>

                <div className="cartControls">
                  <div className="quantityStepper">
                    <button
                      type="button"
                      className="quantityStepperButton"
                      aria-label={`Decrease quantity for ${item.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        handleQuantityChange(item.productId, item.locationId, item.quantity - 1)
                      }
                    >
                      −
                    </button>

                    <input
                      aria-label={`Quantity for ${item.name}`}
                      className="quantityStepperInput"
                      type="number"
                      min="1"
                      max={item.stock}
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, item.locationId, e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="quantityStepperButton"
                      aria-label={`Increase quantity for ${item.name}`}
                      disabled={item.quantity >= item.stock}
                      onClick={() =>
                        handleQuantityChange(item.productId, item.locationId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="dangerButton"
                    onClick={() => handleRemove(item.productId, item.locationId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="summaryCard">
            <h2>Summary</h2>
            <div className="summaryRow">
              <span>Total</span>
              <strong>€{total.toFixed(2)}</strong>
            </div>
            <Link href="/checkout" className="primaryButton fullButton">
              Go to Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
