import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/api";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await login({ email, password });
      setSuccessMessage("Login successful. Redirecting…");
      const destination = location.state?.from || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to login right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Reset & base ──────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; }

        .lp-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT PANEL ────────────────────────────────────────── */
        .lp-left {
          background: #111110;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem;
          min-height: 100vh;
        }

        /* Geometric grid lines */
        .lp-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }

        /* Large decorative circle */
        .lp-deco-circle {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .lp-deco-circle-2 {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .lp-deco-circle-3 {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        /* Accent dot cluster */
        .lp-dot-grid {
          position: absolute;
          bottom: 3.5rem;
          left: 2.5rem;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 6px;
          pointer-events: none;
        }
        .lp-dot-grid span {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: block;
        }

        .lp-left-top {
          position: relative;
          z-index: 1;
        }
        .lp-brand {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .lp-brand-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c97b3a;
        }

        .lp-left-mid {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .lp-display {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #f5f2ec;
        }
        .lp-display em {
          font-style: italic;
          font-weight: 400;
          color: rgba(245,242,236,0.45);
        }
        .lp-left-sub {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.65;
          color: rgba(245,242,236,0.38);
          max-width: 280px;
        }

        /* Feature pills */
        .lp-pills {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .lp-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.78rem;
          font-weight: 400;
          color: rgba(245,242,236,0.4);
        }
        .lp-pill-check {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid rgba(245,242,236,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #c97b3a;
          font-size: 9px;
        }

        .lp-left-bottom {
          position: relative;
          z-index: 1;
          font-size: 0.72rem;
          color: rgba(245,242,236,0.2);
          letter-spacing: 0.02em;
          padding-bottom: 1rem;
        }

        /* ── RIGHT PANEL ───────────────────────────────────────── */
        .lp-right {
          background: #faf8f4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 3.5rem;
          position: relative;
          min-height: 100vh;
        }

        /* Subtle top border accent */
        .lp-right::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c97b3a 0%, transparent 60%);
        }

        .lp-form-wrap {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 0;
          animation: lp-rise 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }

        .lp-form-eyebrow {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c97b3a;
          margin-bottom: 0.75rem;
        }
        .lp-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #111110;
          margin-bottom: 0.4rem;
          line-height: 1.1;
        }
        .lp-form-sub {
          font-size: 0.83rem;
          font-weight: 300;
          color: rgba(17,17,16,0.45);
          margin-bottom: 2rem;
          line-height: 1.55;
        }
        .lp-form-sub a {
          color: #111110;
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid rgba(17,17,16,0.2);
          transition: border-color 0.15s;
        }
        .lp-form-sub a:hover {
          border-color: #111110;
        }

        /* ── Error / Success banners ───────────────────────────── */
        .lp-alert {
          padding: 0.65rem 0.9rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .lp-alert-error {
          background: #fef2f2;
          border: 1px solid rgba(220,38,38,0.15);
          border-left: 3px solid #dc2626;
          color: #991b1b;
          border-radius: 0 8px 8px 0;
        }
        .lp-alert-success {
          background: #f0fdf4;
          border: 1px solid rgba(22,163,74,0.15);
          border-left: 3px solid #16a34a;
          color: #166534;
          border-radius: 0 8px 8px 0;
        }

        /* ── AuthForm override styles ──────────────────────────── */
        /* These target the rendered AuthForm children and unify them
           with the page's visual language. Override as needed if your
           AuthForm uses different class names. */
        .lp-form-wrap .auth-form { display: flex; flex-direction: column; gap: 1rem; }

        .lp-form-wrap label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #111110;
          letter-spacing: 0.01em;
          margin-bottom: 0.3rem;
          display: block;
        }
        .lp-form-wrap input[type="email"],
        .lp-form-wrap input[type="password"],
        .lp-form-wrap input[type="text"] {
          width: 100%;
          padding: 0.7rem 0.9rem;
          background: #fff;
          border: 1px solid rgba(17,17,16,0.12);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          color: #111110;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .lp-form-wrap input:focus {
          border-color: #c97b3a;
          box-shadow: 0 0 0 3px rgba(201,123,58,0.12);
        }
        .lp-form-wrap input::placeholder { color: rgba(17,17,16,0.3); }

        .lp-form-wrap button[type="submit"] {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .lp-form-wrap button[type="submit"]:hover:not(:disabled) {
          background: #2a2a28;
          transform: translateY(-1px);
        }
        .lp-form-wrap button[type="submit"]:active { transform: translateY(0); }
        .lp-form-wrap button[type="submit"]:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ── Divider ───────────────────────────────────────────── */
        .lp-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.5rem 0 1.25rem;
        }
        .lp-divider::before,
        .lp-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(17,17,16,0.08);
        }
        .lp-divider span {
          font-size: 0.72rem;
          color: rgba(17,17,16,0.3);
          font-weight: 400;
          white-space: nowrap;
        }

        .lp-register-link {
          text-align: center;
          font-size: 0.82rem;
          color: rgba(17,17,16,0.45);
          font-weight: 300;
        }
        .lp-register-link a {
          color: #111110;
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid rgba(17,17,16,0.2);
          transition: border-color 0.15s;
        }
        .lp-register-link a:hover { border-color: #111110; }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 768px) {
          .lp-root { grid-template-columns: 1fr; }
          .lp-left  { display: none; }
          .lp-right { padding: 2.5rem 1.75rem; }
        }

        /* ── Animations ────────────────────────────────────────── */
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-left-in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .lp-left-top  { animation: lp-left-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .lp-left-mid  { animation: lp-left-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .lp-left-bottom { animation: lp-left-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
      `}</style>

      <div className="lp-root">

        {/* ── LEFT PANEL ─────────────────────────────────────────── */}
        <aside className="lp-left" aria-hidden="true">
          <div className="lp-deco-circle" />
          <div className="lp-deco-circle-2" />
          <div className="lp-deco-circle-3" />
          <div className="lp-dot-grid">
            {Array.from({ length: 24 }).map((_, i) => <span key={i} />)}
          </div>

          <div className="lp-left-top">
            <Link to="/" className="lp-brand">
              <div className="lp-brand-dot" />
              TaskBoard
            </Link>
          </div>

          <div className="lp-left-mid">
            <h2 className="lp-display">
              Move work<br />
              <em>forward,</em><br />
              every day.
            </h2>
            <p className="lp-left-sub">
              A focused task board that keeps your work organized across every stage.
            </p>
            <div className="lp-pills">
              {[
                "JWT-secured sessions",
                "Private, scoped task boards",
                "Real-time stage updates",
              ].map((f) => (
                <div className="lp-pill" key={f}>
                  <div className="lp-pill-check" aria-hidden="true">✓</div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="lp-left-bottom">
            © {new Date().getFullYear()} TaskBoard · Internship Project
          </div>
        </aside>

        {/* ── RIGHT PANEL ────────────────────────────────────────── */}
        <main className="lp-right">
          <div className="lp-form-wrap">
            <p className="lp-form-eyebrow">Welcome back</p>
            <h1 className="lp-form-title">Sign in</h1>
            <p className="lp-form-sub">
              Don't have an account?{" "}
              <Link to="/register">Create one</Link>
            </p>

            {error && (
              <div className="lp-alert lp-alert-error" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="lp-alert lp-alert-success" role="status">
                {successMessage}
              </div>
            )}

            <AuthForm
              mode="login"
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              successMessage={successMessage}
            />

            <div className="lp-divider">
              <span>or</span>
            </div>

            <p className="lp-register-link">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </main>

      </div>
    </>
  );
};

export default LoginPage;