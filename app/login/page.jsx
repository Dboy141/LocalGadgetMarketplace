"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  requestPhoneOtp,
  signInWithGoogle,
  verifyPhoneOtp,
} from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+36 20 123 4567");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  useEffect(() => {
    setExistingUser(getCurrentUser());
  }, []);

  function handleGoogleSignIn() {
    signInWithGoogle();
    setHasError(false);
    setMessage("Signed in with Google.");
    window.dispatchEvent(new Event("authChanged"));
    router.push("/");
  }

  function handleRequestOtp(e) {
    e.preventDefault();

    const result = requestPhoneOtp(phone);

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setHasError(false);
    setMessage(result.message);
    setOtpSent(true);
  }

  function handleVerifyOtp(e) {
    e.preventDefault();

    const result = verifyPhoneOtp(phone, otp);

    if (!result.success) {
      setHasError(true);
      setMessage(result.message);
      return;
    }

    setHasError(false);
    setMessage("Phone verified.");
    window.dispatchEvent(new Event("authChanged"));
    router.push("/");
  }

  if (existingUser) {
    return (
      <main className="page narrowPage" id="main-content">
        <div className="formCard authCard">
          <p className="eyebrow">Account access</p>
          <h1>You are signed in</h1>
          <p className="muted">
            {existingUser.fullName} is already connected to this session.
          </p>
          <div className="buttonRow">
            <Link
              href={existingUser.role === "admin" ? "/admin" : "/tracking"}
              className="primaryButton"
            >
              {existingUser.role === "admin" ? "Open Admin" : "Track orders"}
            </Link>
            <Link href="/" className="secondaryButton">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page narrowPage" id="main-content">
      <div className="formCard authCard">
        <p className="eyebrow">Account access</p>
        <h1>Sign in</h1>
        <p className="muted">
          Use your phone number or Google to continue.
        </p>

        <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="form">
          <label>
            Phone number
            <input
              className={hasError ? "inputError" : ""}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+36 20 123 4567"
              pattern="^\+?[0-9\s-]{7,18}$"
              required
            />
          </label>

          {otpSent && (
            <label>
              Verification code
              <input
                className={hasError ? "inputError" : ""}
                inputMode="numeric"
                maxLength={6}
                pattern="\d{6}"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
              />
            </label>
          )}

          <button className="primaryButton fullButton" type="submit">
            {otpSent ? "Verify and continue" : "Send verification code"}
          </button>
        </form>

        <button
          className="googleButton fullButton"
          type="button"
          onClick={handleGoogleSignIn}
        >
          <span className="googleMark" aria-hidden="true">G</span>
          Continue with Google
        </button>

        {message && (
          <p className={hasError ? "errorMessage" : "successMessage"}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
