"use client";

import { useState } from "react";
import { signupUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const result = signupUser(form);

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setHasError(false);
    setMessage("Account created.");
    window.dispatchEvent(new Event("authChanged"));
    router.push("/");
  }

  return (
      <main className="page narrowPage">
        <div className="formCard">
          <h1>Create Account</h1>
          <p className="muted">
            Create an account so your orders can be linked to you.
          </p>

          <form onSubmit={handleSubmit} className="form">
            <label>
              Full name
              <input
                  className={hasError ? "inputError" : ""}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Daniel George-Obe"
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
                  placeholder="you@example.com"
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
                  placeholder="Minimum 6 characters"
                  required
              />
            </label>

            <button className="primaryButton" type="submit">
              Sign Up
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