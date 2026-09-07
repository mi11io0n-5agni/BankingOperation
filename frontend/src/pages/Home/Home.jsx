import { Link } from "react-router-dom";
import "./Home.css";

const services = [
  {
    icon: "🏦",
    title: "Account Opening",
    description: "Get assistance with opening a new bank account.",
  },
  {
    icon: "💰",
    title: "Deposit",
    description: "Join the queue for deposit services.",
  },
  {
    icon: "💳",
    title: "Withdrawal",
    description: "Get queue service for account withdrawals.",
  },
  {
    icon: "📱",
    title: "Mobile Banking",
    description: "Register and get support for mobile banking services.",
  },
  {
    icon: "🔄",
    title: "Account Harmonization",
    description: "Get assistance with account information harmonization.",
  },
  {
    icon: "🤝",
    title: "Customer Support",
    description: "Receive help and support for other banking services.",
  },
];

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-badge">COOPBank Seglen Eggu Branch</p>

            <h1>
              Banking Services,
              <span> Without the Long Queue.</span>
            </h1>

           <p className="hero-description">
            Take your queue number online and manage your banking service experience
            easily, quickly, and conveniently.
            </p>

            <div className="hero-buttons">
              <Link to="/get-queue" className="primary-btn">
                Take a Queue Number
              </Link>

              <Link to="/queue-status" className="secondary-btn">
                Check Queue Status
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>6+</strong>
                <span>Banking Services</span>
              </div>

              <div>
                <strong>Easy</strong>
                <span>Queue Management</span>
              </div>

              <div>
                <strong>Fast</strong>
                <span>Customer Service</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="queue-card-header">
              <span>Current Queue</span>
              <span className="live-status">● LIVE</span>
            </div>

            <div className="current-number">
              <p>Now Serving</p>
              <h2>A-023</h2>
              <span>Account Opening</span>
            </div>

            <div className="queue-info">
              <div>
                <span>Waiting</span>
                <strong>12 Customers</strong>
              </div>

              <div>
                <span>Average Wait</span>
                <strong>15 Minutes</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="section-header">
          <p className="section-tag">OUR SERVICES</p>

          <h2>Choose the Banking Service You Need</h2>

          <p>
            Select your required service and get a queue number quickly and
            conveniently.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <Link to="/get-queue" className="service-btn">
                  Get Queue →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <p className="section-tag">HOW IT WORKS</p>

          <h2>Simple and Easy Queue Management</h2>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Select a Service</h3>
            <p>Choose the banking service you need.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Your Number</h3>
            <p>Receive your unique queue number instantly.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Wait for Your Turn</h3>
            <p>Check your queue status while waiting.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Served</h3>
            <p>Visit the service desk when your number is called.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;