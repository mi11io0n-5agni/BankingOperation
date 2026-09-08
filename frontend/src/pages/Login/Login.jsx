import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      // Save authentication
      localStorage.setItem(
        "coopbankToken",
        data.token
      );

      localStorage.setItem(
        "coopbankUser",
        JSON.stringify(data.user)
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setError(
        error.message ||
          "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">

        <div className="login-brand">

          <div className="brand-icon">
            C
          </div>

          <h1>COOPBank</h1>

          <p>
            Queue Management System
          </p>

        </div>

        <div className="login-card">

          <div className="login-header">

            <span className="section-tag">
              EMPLOYEE PORTAL
            </span>

            <h2>Welcome Back</h2>

            <p>
              Sign in to manage customer
              queues and banking services.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            <div className="login-options">

              <label className="remember-me">
                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}

              {!loading && (
                <span>→</span>
              )}
            </button>

          </form>

          <div className="login-security">

            <span>🔒</span>

            <p>
              Secure access for authorized
              bank employees only.
            </p>

          </div>

        </div>

        <p className="login-footer">
          Cooperative Bank of Oromia
          <span> • </span>
          Seglen Eggu Branch
        </p>

      </section>
    </main>
  );
}

export default Login;