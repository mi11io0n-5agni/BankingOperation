import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Temporary frontend login
    // Real authentication will be added with the backend later
    navigate("/dashboard");
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-brand">
          <div className="brand-icon">C</div>

          <h1>COOPBank</h1>

          <p>Queue Management System</p>
        </div>

        <div className="login-card">
          <div className="login-header">
            <span className="section-tag">EMPLOYEE PORTAL</span>

            <h2>Welcome Back</h2>

            <p>
              Sign in to manage customer queues and banking services.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In
              <span>→</span>
            </button>
          </form>

          <div className="login-security">
            <span>🔒</span>

            <p>
              Secure access for authorized bank employees only.
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