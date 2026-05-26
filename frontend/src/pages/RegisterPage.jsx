import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/api";

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async ({ name, email, password }) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await register({ name, email, password });
      setSuccessMessage("Account created! Redirecting…");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to register right now."));
    } finally {
      setLoading(false);
    }
  };

  /* Step indicator data */
  const steps = [
    { n: "01", label: "Create your account",   done: false, active: true  },
    { n: "02", label: "Land on your dashboard", done: false, active: false },
    { n: "03", label: "Start adding tasks",     done: false, active: false },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .rp-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT — FORM PANEL ──────────────────────────────────── */
        .rp-left {
          background: #faf8f4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 3.5rem;
          position: relative;
          min-height: 100vh;
        }

        /* Amber bottom-border accent (mirror of login's top-border) */
        .rp-left::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c97b3a 0%, transparent 60%);
        }

        .rp-form-wrap {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          animation: rp-rise 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }

        .rp-nav-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(17,17,16,0.35);
          text-decoration: none;
          margin-bottom: 2.5rem;
          transition: color 0.15s;
        }
        .rp-nav-back:hover { color: #111110; }
        .rp-nav-back svg { transition: transform 0.15s; }
        .rp-nav-back:hover svg { transform: translateX(-2px); }

        .rp-eyebrow {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c97b3a;
          margin-bottom: 0.65rem;
        }
        .rp-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.85rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #111110;
          line-height: 1.1;
          margin-bottom: 0.4rem;
        }
        .rp-subtitle {
          font-size: 0.83rem;
          font-weight: 300;
          color: rgba(17,17,16,0.45);
          margin-bottom: 2rem;
          line-height: 1.55;
        }
        .rp-subtitle a {
          color: #111110;
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid rgba(17,17,16,0.2);
          transition: border-color 0.15s;
        }
        .rp-subtitle a:hover { border-color: #111110; }

        /* ── Alert banners ──────────────────────────────────────── */
        .rp-alert {
          padding: 0.65rem 0.9rem;
          font-size: 0.82rem;
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          border-radius: 0 8px 8px 0;
        }
        .rp-alert-error {
          background: #fef2f2;
          border: 1px solid rgba(220,38,38,0.15);
          border-left: 3px solid #dc2626;
          color: #991b1b;
        }
        .rp-alert-success {
          background: #f0fdf4;
          border: 1px solid rgba(22,163,74,0.15);
          border-left: 3px solid #16a34a;
          color: #166534;
        }

        /* ── AuthForm field overrides ───────────────────────────── */
        .rp-form-wrap .auth-form { display: flex; flex-direction: column; gap: 1rem; }

        .rp-form-wrap label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #111110;
          letter-spacing: 0.01em;
          margin-bottom: 0.3rem;
          display: block;
        }
        .rp-form-wrap input[type="text"],
        .rp-form-wrap input[type="email"],
        .rp-form-wrap input[type="password"] {
          width: 100%;
          padding: 0.7rem 0.9rem;
          background: #fff;
          border: 1px solid rgba(17,17,16,0.12);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #111110;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .rp-form-wrap input:focus {
          border-color: #c97b3a;
          box-shadow: 0 0 0 3px rgba(201,123,58,0.12);
        }
        .rp-form-wrap input::placeholder { color: rgba(17,17,16,0.28); }

        .rp-form-wrap button[type="submit"] {
          width: 100%;
          padding: 0.75rem 1.25rem;
          background: #111110;
          color: #faf8f4;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: -0.01em;
          transition: background 0.18s, transform 0.12s;
          margin-top: 0.25rem;
        }
        .rp-form-wrap button[type="submit"]:hover:not(:disabled) {
          background: #2a2a28;
          transform: translateY(-1px);
        }
        .rp-form-wrap button[type="submit"]:active  { transform: translateY(0); }
        .rp-form-wrap button[type="submit"]:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ── Terms note ─────────────────────────────────────────── */
        .rp-terms {
          font-size: 0.72rem;
          color: rgba(17,17,16,0.32);
          font-weight: 300;
          line-height: 1.55;
          margin-top: 1rem;
          text-align: center;
        }

        /* ── RIGHT — ILLUSTRATION PANEL ────────────────────────── */
        .rp-right {
          background: #1a2e1f;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem;
          min-height: 100vh;
        }

        /* Diagonal grid lines — "construction" motif */
        .rp-right::before {
          content: '';
          position: absolute;
          inset: -100%;
          background-image:
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.025) 0px,
              rgba(255,255,255,0.025) 1px,
              transparent 1px,
              transparent 52px
            );
          pointer-events: none;
        }

        /* Horizontal grid lines layered on top */
        .rp-right::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 100% 52px;
          pointer-events: none;
        }

        /* Large corner diamond */
        .rp-diamond {
          position: absolute;
          width: 340px;
          height: 340px;
          border: 1px solid rgba(255,255,255,0.06);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          pointer-events: none;
        }
        .rp-diamond-2 {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 1px solid rgba(255,255,255,0.05);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          pointer-events: none;
        }
        .rp-diamond-3 {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(201,123,58,0.06);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          pointer-events: none;
        }

        /* Amber dot cluster — top right */
        .rp-dot-cluster {
          position: absolute;
          top: 2.5rem;
          right: 2.5rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          pointer-events: none;
        }
        .rp-dot-cluster span {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(201,123,58,0.4);
          display: block;
        }

        .rp-right-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rp-brand {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .rp-brand-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #c97b3a;
        }
        .rp-step-badge {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(201,123,58,0.7);
          border: 1px solid rgba(201,123,58,0.25);
          padding: 0.3rem 0.65rem;
          border-radius: 100px;
        }

        /* ── Step tracker ───────────────────────────────────────── */
        .rp-right-mid {
          position: relative;
          z-index: 1;
        }
        .rp-display {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 3.5vw, 3rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #e8f0e9;
          margin-bottom: 0.5rem;
        }
        .rp-display em {
          font-style: italic;
          font-weight: 400;
          color: rgba(232,240,233,0.4);
        }
        .rp-right-sub {
          font-size: 0.83rem;
          font-weight: 300;
          line-height: 1.65;
          color: rgba(232,240,233,0.35);
          max-width: 280px;
          margin-bottom: 2.5rem;
        }

        .rp-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .rp-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.85rem 0;
          position: relative;
        }
        .rp-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 14px;
          top: calc(0.85rem + 28px);
          width: 1px;
          height: calc(100% - 28px);
          background: rgba(255,255,255,0.07);
        }
        .rp-step-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-top: 1px;
          transition: background 0.2s;
        }
        .rp-step-icon.active {
          background: #c97b3a;
          color: #fff;
        }
        .rp-step-icon.idle {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(232,240,233,0.3);
        }
        .rp-step-label {
          font-size: 0.83rem;
          font-weight: 400;
          color: rgba(232,240,233,0.38);
          padding-top: 0.35rem;
          line-height: 1.4;
        }
        .rp-step-label.active {
          color: #e8f0e9;
          font-weight: 500;
        }

        .rp-right-bottom {
          position: relative;
          z-index: 1;
          font-size: 0.72rem;
          color: rgba(232,240,233,0.18);
          letter-spacing: 0.02em;
        }

        /* ── Responsive ─────────────────────────────────────────── */
        @media (max-width: 768px) {
          .rp-root { grid-template-columns: 1fr; }
          .rp-right { display: none; }
          .rp-left  { padding: 2.5rem 1.75rem; }
        }

        /* ── Animations ─────────────────────────────────────────── */
        @keyframes rp-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rp-right-in {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .rp-right-top    { animation: rp-right-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .rp-right-mid    { animation: rp-right-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .rp-right-bottom { animation: rp-right-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
      `}</style>

      <div className="rp-root">

        {/* ── LEFT — FORM ──────────────────────────────────────────── */}
        <main className="rp-left">
          <div className="rp-form-wrap">

            <Link to="/login" className="rp-nav-back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to sign in
            </Link>

            <p className="rp-eyebrow">Get started — it's free</p>
            <h1 className="rp-title">Create your<br />account</h1>
            <p className="rp-subtitle">
              Already have an account?{" "}
              <Link to="/login">Sign in instead</Link>
            </p>

            {error && (
              <div className="rp-alert rp-alert-error" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="rp-alert rp-alert-success" role="status">
                {successMessage}
              </div>
            )}

            <AuthForm
              mode="register"
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              successMessage={successMessage}
            />

            <p className="rp-terms">
              By creating an account you agree to our terms of service.
            </p>
          </div>
        </main>

        {/* ── RIGHT — ILLUSTRATION ─────────────────────────────────── */}
        <aside className="rp-right" aria-hidden="true">
          <div className="rp-diamond"   />
          <div className="rp-diamond-2" />
          <div className="rp-diamond-3" />
          <div className="rp-dot-cluster">
            {Array.from({ length: 16 }).map((_, i) => <span key={i} />)}
          </div>

          <div className="rp-right-top">
            <Link to="/" className="rp-brand">
              <div className="rp-brand-dot" />
              TaskBoard
            </Link>
            <span className="rp-step-badge">Step 1 of 3</span>
          </div>

          <div className="rp-right-mid">
            <h2 className="rp-display">
              Three steps<br />
              to <em>clarity.</em>
            </h2>
            <p className="rp-right-sub">
              From signup to your first task — it takes less than two minutes.
            </p>

            <div className="rp-steps">
              {steps.map((s) => (
                <div className="rp-step" key={s.n}>
                  <div className={`rp-step-icon ${s.active ? "active" : "idle"}`}>
                    {s.n}
                  </div>
                  <span className={`rp-step-label ${s.active ? "active" : ""}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rp-right-bottom">
            © {new Date().getFullYear()} TaskBoard · Internship Project
          </div>
        </aside>

      </div>
    </>
  );
};

export default RegisterPage;