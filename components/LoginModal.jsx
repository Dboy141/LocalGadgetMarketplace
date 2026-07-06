"use client";

import Link from "next/link";
import { useState } from "react";
import { loginUser } from "@/lib/api";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [hasError, setHasError] = useState(false);

    if (!isOpen) return null;

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

        if (onLoginSuccess) {
            onLoginSuccess();
        }

        onClose();
    }

    function handleBackdropClick(e) {
        if (e.target.className === "modalOverlay") {
            onClose();
        }
    }

    return (
        <div className="modalOverlay" onClick={handleBackdropClick}>
            <div className="loginModal">
                <div className="loginModalHeader">
                    <div>
                        <p className="eyebrow">Welcome back</p>
                        <h1>Login</h1>
                    </div>

                    <button className="modalCloseButton" onClick={onClose}>
                        ×
                    </button>
                </div>

                <p className="muted">
                    Log in to continue shopping, view your orders, or access the admin
                    dashboard.
                </p>

                <div className="demoAccounts">
                    <p>
                        <strong>User:</strong> user@test.com / password123
                    </p>
                    <p>
                        <strong>Admin:</strong> admin@test.com / admin123
                    </p>
                </div>

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

                    <button className="primaryButton fullButton" type="submit">
                        Login
                    </button>

                    {message && (
                        <p className={hasError ? "errorMessage" : "successMessage"}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="authSwitchText">
                    No account yet?{" "}
                    <Link href="/signup" onClick={onClose}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}