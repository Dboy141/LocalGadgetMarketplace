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
    imageName: "",
    imagePreview: "",
  });

  function refresh() {
    setProducts(getProducts());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setForm({
      ...form,
      imageName: file.name,
      imagePreview: previewUrl,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    addProduct({
      name: form.name,
      category: form.category,
      brand: form.brand,
      description: form.description,

      // Design-only for now.
      // Later, this will become the real uploaded image URL from Supabase/backend.
      imageName: form.imageName,
      imageUrl: form.imagePreview,
    });

    setForm({
      name: "",
      category: "",
      brand: "",
      description: "",
      imageName: "",
      imagePreview: "",
    });

    refresh();
  }

  function handleDelete(id) {
    deleteProduct(id);
    refresh();
  }

  return (
      <main className="page">
        <div className="pageHeader">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Products</h1>
            <p className="muted">
              Add and manage the gadgets that appear in the marketplace.
            </p>
          </div>
        </div>

        <div className="adminTwoColumn">
          <div className="formCard">
            <h2>Add Product</h2>

            <form onSubmit={handleSubmit} className="form">
              <label>
                Product image
                <div className="imagePicker">
                  {form.imagePreview ? (
                      <img
                          src={form.imagePreview}
                          alt="Selected product preview"
                          className="imagePreview"
                      />
                  ) : (
                      <div className="imagePlaceholder">
                        <span>Choose image</span>
                        <small>PNG, JPG or WEBP</small>
                      </div>
                  )}

                  <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                  />
                </div>

                {form.imageName && (
                    <p className="muted selectedImageName">
                      Selected: {form.imageName}
                    </p>
                )}
              </label>

              <label>
                Name
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Samsung Galaxy A55"
                    required
                />
              </label>

              <label>
                Brand
                <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Samsung"
                    required
                />
              </label>

              <label>
                Category
                <input
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                    placeholder="Smartphone"
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
                    required
                />
              </label>

              <button className="primaryButton" type="submit">
                Add Product
              </button>
            </form>
          </div>

          <div className="tableCard">
            <h2>Product List</h2>

            <div className="responsiveTable">
              <table>
                <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th></th>
                </tr>
                </thead>

                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="tableProductImage"
                            />
                        ) : (
                            <div className="tableProductFallback">
                              {product.brand?.slice(0, 2).toUpperCase() || "PR"}
                            </div>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>
                      <td>
                        <button
                            className="dangerButton"
                            onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                ))}

                {products.length === 0 && (
                    <tr>
                      <td colSpan="5">No products available yet.</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            <p className="muted">
              Image selection is currently for UI demonstration. Real upload will
              be connected when the backend/storage is implemented.
            </p>
          </div>
        </div>
      </main>
  );
}