"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const result = loginUser(form.email, form.password);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage("Login successful.");
    router.push("/");
  }

  return (
    <main className="page narrowPage">
      <div className="formCard">
        <h1>Login</h1>
        <p className="muted">Use this test user: user@test.com / password123</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input
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
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="password123"
              required
            />
          </label>

          <button className="primaryButton" type="submit">Login</button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </main>
  );
}
