"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const result = loginUser(form.email, form.password);

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setHasError(false);
    setMessage("Login successful.");
    window.dispatchEvent(new Event("authChanged"));
    router.push("/");
  }

  return (
      <main className="page narrowPage" id="main-content">
        <div className="formCard">
          <h1>Login</h1>
          <p className="muted">Use this test user: user@test.com / password123</p>

          <form onSubmit={handleSubmit} className="form">
            <label>
              Email
              <input
                  className={hasError ? "inputError" : ""}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@test.com"
                  required
              />
            </label>

            <label>
              Password
              <input
                  className={hasError ? "inputError" : ""}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="password123"
                  required
              />
            </label>

            <button className="primaryButton" type="submit">
              Login
            </button>

            {message && (
                <p className={hasError ? "errorMessage" : "successMessage"}>
                  {message}
                </p>
            )}
          </form>
        </div>
      </main>
  );
}
