import { useState } from "react";
import { Link } from "react-router-dom";
import "./Kiosk.css";

const services = [
  {
    value: "Account Opening",
    label: "Account Opening",
    icon: "🏦",
    description: "Open a new bank account",
  },
  {
    value: "Deposit",
    label: "Deposit",
    icon: "💰",
    description: "Deposit money into your account",
  },
  {
    value: "Withdrawal",
    label: "Withdrawal",
    icon: "💳",
    description: "Withdraw money from your account",
  },
  {
    value: "Mobile Banking",
    label: "Mobile Banking",
    icon: "📱",
    description: "Mobile banking assistance",
  },
  {
    value: "Account Harmonization",
    label: "Account Harmonization",
    icon: "🔄",
    description: "Connect and update your account",
  },
  {
    value: "Customer Support",
    label: "Customer Support",
    icon: "🤝",
    description: "Get help from our staff",
  },
];

function Kiosk() {
  const [ticket, setTicket] = useState(null);
  const [loadingService, setLoadingService] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // CREATE QUEUE
  // ==========================================

  const handleServiceSelect = async (service) => {
    setLoadingService(service.value);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/queues",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerName: "Kiosk Customer",
            phone: "",
            service: service.value,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create queue number."
        );
      }

      // Save the queue returned from MongoDB
      setTicket(data.queue);
    } catch (error) {
      console.error(
        "Kiosk Queue Error:",
        error
      );

      setError(
        error.message ||
          "Unable to create queue. Please ask a staff member for assistance."
      );
    } finally {
      setLoadingService("");
    }
  };

  // ==========================================
  // GET ANOTHER QUEUE
  // ==========================================

  const handleNewQueue = () => {
    setTicket(null);
    setError("");
    setLoadingService("");
  };

  // ==========================================
  // TICKET SCREEN
  // ==========================================

  if (ticket) {
    return (
      <main className="kiosk-page">
        <section className="kiosk-ticket-section">

          <div className="kiosk-success-icon">
            ✓
          </div>

          <span className="kiosk-tag">
            QUEUE REGISTERED
          </span>

          <h1>Your Queue Number</h1>

          <p className="kiosk-ticket-intro">
            Please remember your queue number and wait
            for your number to be called.
          </p>

          <div className="kiosk-ticket">

            <div className="kiosk-ticket-brand">
              <div className="kiosk-brand-icon">
                C
              </div>

              <div>
                <strong>COOPBank</strong>
                <span>
                  Seglen Eggu Branch
                </span>
              </div>
            </div>

            <div className="kiosk-ticket-number">

              <span>YOUR NUMBER</span>

              <strong>
                {ticket.queueNumber}
              </strong>

            </div>

            <div className="kiosk-ticket-service">

              <span>SELECTED SERVICE</span>

              <strong>
                {ticket.service}
              </strong>

            </div>

            <div className="kiosk-ticket-status">

              <span>Status</span>

              <strong>
                {ticket.status}
              </strong>

            </div>

            <div className="kiosk-ticket-message">
              Please wait until your queue number
              appears on the display screen.
            </div>

          </div>

          <div className="kiosk-ticket-actions">

            <button
              className="kiosk-new-btn"
              onClick={handleNewQueue}
            >
              Get Another Queue
            </button>

            <Link
              to="/queue-status"
              className="kiosk-status-btn"
            >
              Check Queue Status
            </Link>

          </div>

        </section>
      </main>
    );
  }

  // ==========================================
  // KIOSK SERVICE SELECTION
  // ==========================================

  return (
    <main className="kiosk-page">

      <section className="kiosk-container">

        {/* HEADER */}

        <div className="kiosk-header">

          <div className="kiosk-logo">
            C
          </div>

          <span className="kiosk-tag">
            COOPBANK SELF-SERVICE
          </span>

          <h1>
            Welcome to COOPBank
          </h1>

          <p>
            Please select the banking service
            you need.
          </p>

          <small>
            Touch one of the services below
          </small>

        </div>

        {/* SERVICES */}

        <div className="kiosk-services">

          {services.map((service) => (

            <button
              key={service.value}
              type="button"
              className={`kiosk-service-card ${
                loadingService === service.value
                  ? "loading"
                  : ""
              }`}
              onClick={() =>
                handleServiceSelect(service)
              }
              disabled={
                loadingService !== ""
              }
            >

              <span className="kiosk-service-icon">
                {service.icon}
              </span>

              <span className="kiosk-service-content">

                <strong>
                  {service.label}
                </strong>

                <span>
                  {service.description}
                </span>

              </span>

              <span className="kiosk-service-arrow">
                {loadingService === service.value
                  ? "..."
                  : "→"}
              </span>

            </button>

          ))}

        </div>

        {/* ERROR */}

        {error && (
          <div className="kiosk-error">
            <strong>
              Something went wrong
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
            >
              Try Again
            </button>
          </div>
        )}

        {/* HELP */}

        <div className="kiosk-help">

          <span className="kiosk-help-icon">
            ?
          </span>

          <div>
            <strong>
              Need help?
            </strong>

            <p>
              If you need assistance using this kiosk,
              please ask a COOPBank staff member.
            </p>
          </div>

        </div>

        {/* STAFF ASSISTANCE */}

        <div className="kiosk-staff-note">

          <span>👨‍💼</span>

          <p>
            Customers who need assistance can
            request a queue number from our staff.
          </p>

        </div>

      </section>

    </main>
  );
}

export default Kiosk;