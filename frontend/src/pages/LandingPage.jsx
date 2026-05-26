import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .lp-root {
          min-height: 100vh;
          background: #0a0a0b;
          color: #f0ede8;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          overflow-x: hidden;
        }

        /* ── Noise texture overlay ── */
        .lp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── Grid lines ── */
        .lp-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 72px 72px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Glow orbs ── */
        .lp-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(120px);
        }
        .lp-orb-1 {
          width: 600px; height: 600px;
          top: -200px; left: -150px;
          background: radial-gradient(circle, rgba(99,78,180,0.18) 0%, transparent 70%);
        }
        .lp-orb-2 {
          width: 500px; height: 500px;
          bottom: -100px; right: -100px;
          background: radial-gradient(circle, rgba(29,158,117,0.14) 0%, transparent 70%);
        }

        /* ── NAV ── */
        .lp-nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lp-nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 1.25rem;
          letter-spacing: -0.01em;
          color: #f0ede8;
          text-decoration: none;
        }
        .lp-nav-logo span {
          color: rgba(240,237,232,0.4);
        }
        .lp-nav-pill {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.35rem 0.85rem;
          border-radius: 100px;
        }

        /* ── HERO ── */
        .lp-hero {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 7rem 2rem 5rem;
          max-width: 900px;
          margin: 0 auto;
          gap: 0;
        }
        .lp-eyebrow {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.35);
          margin-bottom: 1.75rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .lp-eyebrow::before,
        .lp-eyebrow::after {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: rgba(240,237,232,0.2);
        }
        .lp-h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #f0ede8;
          margin: 0 0 0.25rem;
        }
        .lp-h1 em {
          font-style: italic;
          color: rgba(240,237,232,0.5);
        }
        .lp-subhead {
          font-size: 1.05rem;
          font-weight: 300;
          line-height: 1.65;
          color: rgba(240,237,232,0.5);
          max-width: 480px;
          margin: 1.75rem auto 2.75rem;
        }
        .lp-actions {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* Primary CTA */
        .lp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f0ede8;
          color: #0a0a0b;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: -0.01em;
        }
        .lp-btn-primary:hover {
          background: #ffffff;
          transform: translateY(-1px);
        }
        .lp-btn-primary svg {
          transition: transform 0.2s;
        }
        .lp-btn-primary:hover svg {
          transform: translateX(3px);
        }

        /* Secondary CTA */
        .lp-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: rgba(240,237,232,0.65);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.12);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
          letter-spacing: -0.01em;
        }
        .lp-btn-secondary:hover {
          border-color: rgba(255,255,255,0.28);
          color: #f0ede8;
          transform: translateY(-1px);
        }

        /* ── DIVIDER ── */
        .lp-divider {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent 100%);
          margin: 0;
        }

        /* ── FEATURES ── */
        .lp-features-wrap {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 2rem 7rem;
        }
        .lp-features-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.25);
          margin-bottom: 3rem;
          text-align: center;
        }
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (max-width: 720px) {
          .lp-features-grid { grid-template-columns: 1fr; }
          .lp-nav { padding: 1.25rem 1.5rem; }
          .lp-hero { padding: 5rem 1.5rem 4rem; }
          .lp-features-wrap { padding: 4rem 1.5rem 5rem; }
        }
        .lp-feature-card {
          background: #0e0e10;
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: background 0.25s;
          position: relative;
          overflow: hidden;
        }
        .lp-feature-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,78,180,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .lp-feature-card:hover {
          background: #121215;
        }
        .lp-feature-card:hover::after {
          opacity: 1;
        }
        .lp-feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(99,78,180,0.15);
          border: 1px solid rgba(99,78,180,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a99cf0;
          flex-shrink: 0;
        }
        .lp-feature-num {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: rgba(240,237,232,0.2);
          margin-left: auto;
          align-self: flex-start;
        }
        .lp-feature-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .lp-feature-h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #f0ede8;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0;
        }
        .lp-feature-p {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.65;
          color: rgba(240,237,232,0.4);
          margin: 0;
        }

        /* ── FOOTER ── */
        .lp-footer {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 0.75rem;
          color: rgba(240,237,232,0.2);
          letter-spacing: 0.02em;
        }

        /* ── Animations ── */
        @keyframes lp-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lp-anim { animation: lp-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .lp-anim-d1 { animation-delay: 0.05s; }
        .lp-anim-d2 { animation-delay: 0.15s; }
        .lp-anim-d3 { animation-delay: 0.25s; }
        .lp-anim-d4 { animation-delay: 0.35s; }
        .lp-anim-d5 { animation-delay: 0.45s; }
        .lp-anim-d6 { animation-delay: 0.1s; }
        .lp-anim-d7 { animation-delay: 0.2s; }
        .lp-anim-d8 { animation-delay: 0.3s; }
      `}</style>

      <div className="lp-root">
        <div className="lp-grid-bg" aria-hidden="true" />
        <div className="lp-orb lp-orb-1" aria-hidden="true" />
        <div className="lp-orb lp-orb-2" aria-hidden="true" />

        {/* NAV */}
        <nav className="lp-nav lp-anim">
          <a href="/" className="lp-nav-logo">
            Task<span>Manager</span>
          </a>
          <span className="lp-nav-pill">Internship Project</span>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <p className="lp-eyebrow lp-anim lp-anim-d1">Task Management Reimagined</p>

          <h1 className="lp-h1 lp-anim lp-anim-d2">
            Your work,<br />
            <em>beautifully</em> organized
          </h1>

          <p className="lp-subhead lp-anim lp-anim-d3">
            A focused board for Todo, In Progress, and Done.
            Register, login, and manage your own tasks — privately and securely.
          </p>

          <div className="lp-actions lp-anim lp-anim-d4">
            <Link
              className="lp-btn-primary"
              to={isAuthenticated ? "/dashboard" : "/register"}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            {!isAuthenticated && (
              <Link className="lp-btn-secondary" to="/login">
                Sign in
              </Link>
            )}
          </div>
        </section>

        <div className="lp-divider" />

        {/* FEATURES */}
        <div className="lp-features-wrap">
          <p className="lp-features-label lp-anim lp-anim-d5">Everything you need</p>

          <div className="lp-features-grid">
            {[
              {
                num: "01",
                icon: <CheckCircle2 size={16} strokeWidth={1.75} />,
                title: "Secure Authentication",
                desc: "JWT-based login and protected routes with bcrypt password hashing on the backend.",
                delay: "lp-anim-d6",
              },
              {
                num: "02",
                icon: <CheckCircle2 size={16} strokeWidth={1.75} />,
                title: "Task Board Workflow",
                desc: "Create and manage tasks across Todo, In Progress, and Done with real-time stage updates.",
                delay: "lp-anim-d7",
              },
              {
                num: "03",
                icon: <CheckCircle2 size={16} strokeWidth={1.75} />,
                title: "User Scoped Data",
                desc: "Every user sees only their own tasks — for a clean, private dashboard experience.",
                delay: "lp-anim-d8",
              },
            ].map((f) => (
              <article key={f.num} className={`lp-feature-card lp-anim ${f.delay}`}>
                <div className="lp-feature-title-row">
                  <div className="lp-feature-icon" aria-hidden="true">
                    {f.icon}
                  </div>
                  <span className="lp-feature-num">{f.num}</span>
                </div>
                <h3 className="lp-feature-h3">{f.title}</h3>
                <p className="lp-feature-p">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>

        <footer className="lp-footer">
          © {new Date().getFullYear()} TaskManager · Internship Assignment Project
        </footer>
      </div>
    </>
  );
};

export default LandingPage;