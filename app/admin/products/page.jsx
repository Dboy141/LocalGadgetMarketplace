"use client";

import { useEffect, useState } from "react";
import { addProduct, deleteProduct, getProducts } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function refresh() {
    setProducts(getProducts());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const result = addProduct(form);

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setForm({
      name: "",
      category: "",
      brand: "",
      description: "",
    });

    setHasError(false);
    setMessage(result.message);
    refresh();
  }

  function handleDelete(id) {
    deleteProduct(id);
    refresh();
  }

  return (
      <main className="page" id="main-content">
        <div className="pageHeader">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Products</h1>
            <p className="muted">
              Add and manage the gadgets that appear in the store.
            </p>
          </div>
        </div>

        <div className="adminTwoColumn">
          <div className="formCard">
            <h2>Add Product</h2>

            <form onSubmit={handleSubmit} className="form">
              <label>
                Name
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Samsung Galaxy A55"
                    minLength={2}
                    required
                />
              </label>

              <label>
                Brand
                <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Samsung"
                    minLength={2}
                    required
                />
              </label>

              <label>
                Category
                <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Smartphone"
                    minLength={2}
                    required
                />
              </label>

              <label>
                Description
                <textarea
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Short product description..."
                    minLength={8}
                    required
                />
              </label>

              <button className="primaryButton" type="submit">
                Add Product
              </button>

              {message && (
                  <p className={hasError ? "errorMessage" : "successMessage"}>
                    {message}
                  </p>
              )}
            </form>
          </div>

          <div className="tableCard">
            <h2>Product List</h2>

            <div className="responsiveTable">
              <table>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th></th>
                </tr>
                </thead>

                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>
                      <td>
                        <button
                            className="dangerButton"
                            onClick={() => handleDelete(product.id)}
                            aria-label={`Delete ${product.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                ))}

                {products.length === 0 && (
                    <tr>
                      <td colSpan="4">No products available yet.</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
  );
}
