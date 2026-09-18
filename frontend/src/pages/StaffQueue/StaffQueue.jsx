import { useState } from "react";
import { Link } from "react-router-dom";
import "./StaffQueue.css";

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
    description: "Deposit money into an account",
  },
  {
    value: "Withdrawal",
    label: "Withdrawal",
    icon: "💳",
    description: "Withdraw money from an account",
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
    description: "Connect or update an account",
  },
  {
    value: "Customer Support",
    label: "Customer Support",
    icon: "🤝",
    description: "General customer assistance",
  },
];

function StaffQueue() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    service: "",
  });

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("coopbankUser");

  let employee = null;

  try {
    employee = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error("Invalid employee data:", error);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleServiceSelect = (service) => {
    setFormData((previous) => ({
      ...previous,
      service,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("coopbankToken");

      if (!token) {
        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/queues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create queue number."
        );
      }

      setTicket(data.queue);
    } catch (error) {
      console.error(
        "Staff Queue Registration Error:",
        error
      );

      setError(
        error.message ||
          "Unable to create queue number. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewQueue = () => {
    setTicket(null);
    setError("");

    setFormData({
      customerName: "",
      phone: "",
      service: "",
    });
  };

  // ==========================================
  // GENERATED TICKET
  // ==========================================

  if (ticket) {
    return (
      <main className="staff-queue-page">
        <section className="staff-ticket-section">
          <div className="staff-success-icon">
            ✓
          </div>

          <span className="staff-section-tag">
            QUEUE REGISTERED
          </span>

          <h1>Queue Number Created</h1>

          <p className="staff-ticket-intro">
            The customer's queue has been successfully
            registered.
          </p>

          <div className="staff-ticket">
            <div className="staff-ticket-header">
              <div className="staff-ticket-brand">
                <div className="staff-brand-icon">
                  C
                </div>

                <div>
                  <strong>COOPBank</strong>
                  <span>
                    Seglen Eggu Branch
                  </span>
                </div>
              </div>

              <span className="staff-ticket-status">
                {ticket.status}
              </span>
            </div>

            <div className="staff-ticket-number">
              <span>QUEUE NUMBER</span>
              <strong>{ticket.queueNumber}</strong>
            </div>

            <div className="staff-ticket-details">
              <div className="staff-ticket-detail">
                <span>Customer</span>
                <strong>
                  {ticket.customerName}
                </strong>
              </div>

              <div className="staff-ticket-detail">
                <span>Service</span>
                <strong>
                  {ticket.service}
                </strong>
              </div>

              {ticket.phone && (
                <div className="staff-ticket-detail">
                  <span>Phone</span>
                  <strong>
                    {ticket.phone}
                  </strong>
                </div>
              )}
            </div>

            <div className="staff-ticket-note">
              <span>ⓘ</span>

              <p>
                Please give the queue number to the
                customer and ask them to wait until
                their number is called.
              </p>
            </div>
          </div>

          <div className="staff-ticket-actions">
            <button
              type="button"
              className="staff-primary-btn"
              onClick={handleNewQueue}
            >
              Register Another Customer
            </button>

            <Link
              to="/dashboard"
              className="staff-secondary-btn"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // STAFF REGISTRATION FORM
  // ==========================================

  return (
    <main className="staff-queue-page">
      <section className="staff-queue-container">
        <div className="staff-page-header">
          <div className="staff-header-icon">
            👨‍💼
          </div>

          <div>
            <span className="staff-section-tag">
              STAFF-ASSISTED REGISTRATION
            </span>

            <h1>Register Customer for Queue</h1>

            <p>
              Create a queue number on behalf of a
              customer who needs staff assistance.
            </p>
          </div>
        </div>

        {employee && (
          <div className="staff-user-card">
            <div className="staff-user-avatar">
              {employee.name
                ? employee.name.charAt(0).toUpperCase()
                : "E"}
            </div>

            <div>
              <span>Registered by</span>

              <strong>
                {employee.name || "Bank Employee"}
              </strong>

              <small>
                {employee.service
                  ? `Assigned Service: ${employee.service}`
                  : "Bank Staff"}
              </small>
            </div>
          </div>
        )}

        <form
          className="staff-queue-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <div className="form-section-heading">
              <span>01</span>

              <div>
                <h2>Customer Information</h2>

                <p>
                  Enter the customer's basic information.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="staff-form-group">
                <label htmlFor="customerName">
                  Customer Name
                  <span className="required">*</span>
                </label>

                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer's full name"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="staff-form-group">
                <label htmlFor="phone">
                  Phone Number
                  <span className="optional">
                    Optional
                  </span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09XXXXXXXX"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-heading">
              <span>02</span>

              <div>
                <h2>Select Banking Service</h2>

                <p>
                  Select the service requested by the
                  customer.
                </p>
              </div>
            </div>

            <div className="staff-service-grid">
              {services.map((service) => (
                <button
                  key={service.value}
                  type="button"
                  className={`staff-service-option ${
                    formData.service === service.value
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleServiceSelect(
                      service.value
                    )
                  }
                >
                  <span className="staff-service-icon">
                    {service.icon}
                  </span>

                  <span className="staff-service-content">
                    <strong>
                      {service.label}
                    </strong>

                    <small>
                      {service.description}
                    </small>
                  </span>

                  <span className="staff-check">
                    {formData.service === service.value
                      ? "✓"
                      : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="staff-form-error">
              <span>!</span>

              <div>
                <strong>
                  Unable to register queue
                </strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="staff-form-actions">
            <Link
              to="/dashboard"
              className="staff-cancel-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="staff-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Queue..."
                : "Generate Queue Number"}

              {!loading && <span>→</span>}
            </button>
          </div>
        </form>

        <div className="staff-information">
          <div className="staff-information-icon">
            ⓘ
          </div>

          <div>
            <strong>
              Staff Assistance
            </strong>

            <p>
              Use this page when a customer needs
              assistance getting a queue number. Make
              sure you select the correct banking service
              before generating the queue.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default StaffQueue;