import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <span className="logo-icon">C</span>

          <div className="logo-text">
            <h2>COOPBank</h2>
            <span>Queue Management System</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/#services">
            Services
          </Link>

          <Link to="/queue-status">
            Queue Status
          </Link>

          <Link to="/login" className="login-btn">
            Employee Login
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;