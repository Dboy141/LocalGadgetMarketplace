"use client";

import { useEffect, useState } from "react";
import { addLocation, deleteLocation, getLocations } from "@/lib/api";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function refresh() {
    setLocations(getLocations());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const result = addLocation({
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    });

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setForm({ name: "", city: "", address: "", latitude: "", longitude: "" });
    setHasError(false);
    setMessage(result.message);
    refresh();
  }

  function handleDelete(id) {
    deleteLocation(id);
    refresh();
  }

  return (
    <main className="page" id="main-content">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Locations</h1>
        </div>
      </div>

      <div className="adminTwoColumn">
        <div className="formCard">
          <h2>Add Location</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Location name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} required />
            </label>
            <label>
              City
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} minLength={2} required />
            </label>
            <label>
              Address
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} minLength={4} required />
            </label>
            <label>
              Latitude
              <input type="number" min="-90" max="90" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required />
            </label>
            <label>
              Longitude
              <input type="number" min="-180" max="180" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required />
            </label>

            <button className="primaryButton" type="submit">Add Location</button>

            {message && (
              <p className={hasError ? "errorMessage" : "successMessage"}>
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="tableCard">
          <h2>Location List</h2>
          <div className="responsiveTable">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Address</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.id}>
                    <td>{location.name}</td>
                    <td>{location.city}</td>
                    <td>{location.address}</td>
                    <td>
                      <button
                        className="dangerButton"
                        onClick={() => handleDelete(location.id)}
                        aria-label={`Delete ${location.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
