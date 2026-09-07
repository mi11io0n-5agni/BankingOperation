import { useState } from "react";
import { Link } from "react-router-dom";
import "./GetQueue.css";

const services = [
  {
    value: "Account Opening",
    label: "Account Opening",
    icon: "🏦",
  },
  {
    value: "Deposit",
    label: "Deposit",
    icon: "💰",
  },
  {
    value: "Withdrawal",
    label: "Withdrawal",
    icon: "💳",
  },
  {
    value: "Mobile Banking",
    label: "Mobile Banking",
    icon: "📱",
  },
  {
    value: "Account Harmonization",
    label: "Account Harmonization",
    icon: "🔄",
  },
  {
    value: "Customer Support",
    label: "Customer Support",
    icon: "🤝",
  },
];

function GetQueue() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    service: "",
  });

  const [ticket, setTicket] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const generateQueueNumber = () => {
    const number = Math.floor(Math.random() * 900) + 100;

    return `A-${number}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.customerName.trim() || !formData.service) {
      return;
    }

    const newTicket = {
      queueNumber: generateQueueNumber(),
      customerName: formData.customerName,
      phone: formData.phone,
      service: formData.service,
      status: "Waiting",
    };

    setTicket(newTicket);
  };

  const handleNewQueue = () => {
    setTicket(null);

    setFormData({
      customerName: "",
      phone: "",
      service: "",
    });
  };

  if (ticket) {
    return (
      <main className="get-queue-page">
        <section className="ticket-section">
          <div className="success-message">
            <div className="success-icon">✓</div>

            <h1>Your Queue Number</h1>

            <p>
              Your queue has been successfully registered.
            </p>
          </div>

          <div className="queue-ticket">
            <div className="ticket-header">
              <div>
                <span>COOPBank</span>
                <small>Seglen Eggu Branch</small>
              </div>

              <span className="ticket-status">
                {ticket.status}
              </span>
            </div>

            <div className="ticket-number">
              <span>YOUR NUMBER</span>

              <strong>{ticket.queueNumber}</strong>
            </div>

            <div className="ticket-details">
              <div>
                <span>Customer</span>
                <strong>{ticket.customerName}</strong>
              </div>

              <div>
                <span>Service</span>
                <strong>{ticket.service}</strong>
              </div>

              {ticket.phone && (
                <div>
                  <span>Phone</span>
                  <strong>{ticket.phone}</strong>
                </div>
              )}
            </div>

            <div className="ticket-note">
              Please wait until your queue number is called.
            </div>
          </div>

          <div className="ticket-actions">
            <button
              className="primary-btn"
              onClick={handleNewQueue}
            >
              Get Another Queue
            </button>

            <Link
              to="/queue-status"
              className="secondary-btn"
            >
              Check Queue Status
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="get-queue-page">
      <section className="queue-form-section">
        <div className="page-heading">
          <span className="section-tag">
            QUEUE REGISTRATION
          </span>

          <h1>Get Your Queue Number</h1>

          <p>
            Tell us what banking service you need and we'll
            give you a queue number.
          </p>
        </div>

        <form
          className="queue-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="customerName">
              Customer Name
            </label>

            <input
              id="customerName"
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number
              <span>Optional</span>
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label>
              Select Banking Service
            </label>

            <div className="service-options">
              {services.map((service) => (
                <label
                  className={`service-option ${
                    formData.service === service.value
                      ? "selected"
                      : ""
                  }`}
                  key={service.value}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.value}
                    checked={
                      formData.service === service.value
                    }
                    onChange={handleChange}
                  />

                  <span className="option-icon">
                    {service.icon}
                  </span>

                  <span className="option-content">
                    <strong>{service.label}</strong>
                  </span>

                  <span className="radio-circle"></span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="generate-btn"
          >
            Generate Queue Number
            <span>→</span>
          </button>
        </form>

        <div className="queue-help">
          <span>ⓘ</span>

          <p>
            Please make sure you select the correct service
            before getting your queue number.
          </p>
        </div>
      </section>
    </main>
  );
}

export default GetQueue;