"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addToCart,
  detectNearestLocation,
  getLocations,
  getProductsForLocation,
  getSelectedLocationId,
  setSelectedLocationId,
} from "@/lib/api";
import Toast from "@/components/Toast";

export default function ProductBrowser() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [products, setProducts] = useState([]);
  const [locationStatus, setLocationStatus] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  function showToast(message, type = "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 2500);
  }

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

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category).filter(Boolean))];
  }, [products]);

  const brands = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.brand).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
          product.name.toLowerCase().includes(searchValue) ||
          product.brand.toLowerCase().includes(searchValue) ||
          product.category.toLowerCase().includes(searchValue);

      const matchesCategory =
          categoryFilter === "All" || product.category === categoryFilter;

      const matchesBrand =
          brandFilter === "All" || product.brand === brandFilter;

      return matchesSearch && matchesCategory && matchesBrand;
    });

    if (sortOption === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortOption === "stock-high") {
      result = [...result].sort((a, b) => b.stock - a.stock);
    }

    return result;
  }, [products, searchTerm, categoryFilter, brandFilter, sortOption]);

  function handleManualLocationChange(e) {
    const locationId = Number(e.target.value);
    setSelectedLocation(String(locationId));
    setSelectedLocationId(locationId);
    refreshProducts(locationId);
  }

  function handleDetectLocation() {
    setLocationStatus("Checking your browser location...");

    if (!navigator.geolocation) {
      setLocationStatus(
          "Your browser does not support geolocation. Choose a location manually."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
          const nearest = detectNearestLocation(
              position.coords.latitude,
              position.coords.longitude
          );

          if (!nearest) {
            setLocationStatus("No store locations are available yet.");
            return;
          }

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
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
  }

  return (
      <section className="shopSection">
        <Toast message={toast.message} type={toast.type} />

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

        <div className="filterBar">
          <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, brand, or category..."
          />

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All categories" : category}
                </option>
            ))}
          </select>

          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
            {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === "All" ? "All brands" : brand}
                </option>
            ))}
          </select>

          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Default sorting</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="stock-high">Most stock</option>
          </select>
        </div>

        {products.length === 0 ? (
            <div className="emptyState">
              <h2>No products available here.</h2>
              <p>Choose another location or update inventory as admin.</p>
            </div>
        ) : filteredProducts.length === 0 ? (
            <div className="emptyState">
              <h2>No products match your search.</h2>
              <p>Try another keyword, brand, category, or sorting option.</p>
            </div>
        ) : (
            <div className="productGrid">
              {filteredProducts.map((product) => (
                  <article
                      className="productCard"
                      key={`${product.productId}-${product.locationId}`}
                  >
                    <div className="productImage">
                      {product.brand.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="productBody">
                      <p className="productCategory">{product.category}</p>
                      <h3>{product.name}</h3>
                      <p className="muted">{product.description}</p>

                      <div className="productMeta">
                        <span className="priceHighlight">€{product.price.toFixed(2)}</span>
                        <span>{product.stock} in stock</span>
                      </div>

                      {product.stock <= product.lowStockThreshold && (
                          <p className="stockWarning">Almost sold out at this location</p>
                      )}

                      <button
                          className="primaryButton fullButton"
                          onClick={() => handleAddToCart(product)}
                      >
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