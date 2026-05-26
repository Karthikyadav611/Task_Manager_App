import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AuthForm = ({ mode, onSubmit, loading, error, successMessage }) => {
  const isRegisterMode = mode === "register";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [inlineError, setInlineError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegisterMode && !formData.name.trim()) {
      setInlineError("Name is required.");
      return;
    }
    if (!formData.email.trim() || !formData.password.trim()) {
      setInlineError("Email and password are required.");
      return;
    }
    if (formData.password.trim().length < 6) {
      setInlineError("Password must be at least 6 characters.");
      return;
    }

    setInlineError("");
    await onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    });
  };

  return (
    <div className="auth-card">
      <h2>{isRegisterMode ? "Create your account" : "Welcome back"}</h2>
      <p>{isRegisterMode ? "Register to manage your tasks faster." : "Login to continue to your dashboard."}</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isRegisterMode ? (
          <label>
            Full Name
            <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </label>
        ) : null}

        <label>
          Email
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
          />
        </label>

        {inlineError ? <p className="inline-error">{inlineError}</p> : null}
        {error ? <p className="inline-error">{error}</p> : null}
        {successMessage ? <p className="inline-success">{successMessage}</p> : null}

        <button className="primary-button" type="submit" disabled={loading}>
          {isRegisterMode ? <UserPlus size={16} /> : <LogIn size={16} />}
          {loading ? "Please wait..." : isRegisterMode ? "Register" : "Login"}
        </button>
      </form>

      <p className="auth-switch-text">
        {isRegisterMode ? "Already have an account?" : "New here?"}{" "}
        <Link to={isRegisterMode ? "/login" : "/register"}>
          {isRegisterMode ? "Login" : "Create account"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
