"use client";

import { useEffect, useState } from "react";
import {
  addToCart,
  detectNearestLocation,
  getLocations,
  getProductsForLocation,
  getSelectedLocationId,
  setSelectedLocationId,
} from "@/lib/api";

export default function ProductBrowser() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [products, setProducts] = useState([]);
  const [locationStatus, setLocationStatus] = useState("");

  function refreshProducts(locationId) {
    if (!locationId) {
      setProducts([]);
      return;
    }

    setProducts(getProductsForLocation(Number(locationId)));
  }

  useEffect(() => {
    const allLocations = getLocations();
    setLocations(allLocations);

    const savedLocation = getSelectedLocationId();

    if (savedLocation) {
      setSelectedLocation(String(savedLocation));
      refreshProducts(savedLocation);
    } else if (allLocations.length > 0) {
      const firstLocationId = allLocations[0].id;
      setSelectedLocation(String(firstLocationId));
      setSelectedLocationId(firstLocationId);
      refreshProducts(firstLocationId);
    }
  }, []);

  function handleManualLocationChange(e) {
    const locationId = Number(e.target.value);
    setSelectedLocation(String(locationId));
    setSelectedLocationId(locationId);
    refreshProducts(locationId);
  }

  function handleDetectLocation() {
    setLocationStatus("Checking your browser location...");

    if (!navigator.geolocation) {
      setLocationStatus("Your browser does not support geolocation. Choose a location manually.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = detectNearestLocation(
          position.coords.latitude,
          position.coords.longitude
        );

        setSelectedLocation(String(nearest.id));
        setSelectedLocationId(nearest.id);
        refreshProducts(nearest.id);
        setLocationStatus(`Nearest location selected: ${nearest.name}`);
      },
      () => {
        setLocationStatus("Location permission was blocked. Choose a location manually.");
      }
    );
  }

  function handleAddToCart(product) {
    const result = addToCart(product.productId, product.locationId);

    if (result.success) {
      window.dispatchEvent(new Event("cartUpdated"));
    }

    alert(result.message);
  }

  return (
    <section className="shopSection">
      <div className="locationCard">
        <div>
          <p className="eyebrow">Your shopping location</p>
          <h2>Choose where you want to buy from</h2>
          <p className="muted">
            Product prices and stock change depending on the selected location.
          </p>
        </div>

        <div className="locationActions">
          <select value={selectedLocation} onChange={handleManualLocationChange}>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} — {location.city}
              </option>
            ))}
          </select>

          <button className="secondaryButton" onClick={handleDetectLocation}>
            Use Browser Location
          </button>
        </div>

        {locationStatus && <p className="message">{locationStatus}</p>}
      </div>

      <div className="sectionTitle">
        <div>
          <p className="eyebrow">Available gadgets</p>
          <h2>Products near you</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="emptyState">
          <h2>No products available here.</h2>
          <p>Choose another location or update inventory as admin.</p>
        </div>
      ) : (
        <div className="productGrid">
          {products.map((product) => (
            <article className="productCard" key={`${product.productId}-${product.locationId}`}>
              <div className="productImage">{product.brand.slice(0, 2).toUpperCase()}</div>
              <div className="productBody">
                <p className="productCategory">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="muted">{product.description}</p>

                <div className="productMeta">
                  <span>€{product.price.toFixed(2)}</span>
                  <span>{product.stock} in stock</span>
                </div>

                {product.stock <= product.lowStockThreshold && (
                  <p className="stockWarning">Almost sold out at this location</p>
                )}

                <button className="primaryButton fullButton" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
