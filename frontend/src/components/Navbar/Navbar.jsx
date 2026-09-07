import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-icon">C</span>
          <div className="logo-text">
            <h2>COOPBank</h2>
            <span>Queue Management System</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#queue">Queue Status</a>

          <button className="login-btn">
            Employee Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;