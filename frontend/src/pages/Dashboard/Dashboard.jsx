import { useState } from "react";
import "./Dashboard.css";

const initialQueue = [
  {
    id: 1,
    queueNumber: "A-101",
    customerName: "Abebe Kebede",
    service: "Account Opening",
    status: "Waiting",
    time: "09:15 AM",
  },
  {
    id: 2,
    queueNumber: "A-102",
    customerName: "Hana Gemechu",
    service: "Deposit",
    status: "Waiting",
    time: "09:20 AM",
  },
  {
    id: 3,
    queueNumber: "A-103",
    customerName: "Mohammed Ali",
    service: "Mobile Banking",
    status: "Serving",
    time: "09:25 AM",
  },
  {
    id: 4,
    queueNumber: "A-104",
    customerName: "Sara Tesfaye",
    service: "Withdrawal",
    status: "Waiting",
    time: "09:30 AM",
  },
  {
    id: 5,
    queueNumber: "A-105",
    customerName: "Daniel Bekele",
    service: "Customer Support",
    status: "Completed",
    time: "09:35 AM",
  },
];

function Dashboard() {
  const [queue, setQueue] = useState(initialQueue);

  const waitingCustomers = queue.filter(
    (customer) => customer.status === "Waiting"
  );

  const servingCustomer = queue.find(
    (customer) => customer.status === "Serving"
  );

  const completedCustomers = queue.filter(
    (customer) => customer.status === "Completed"
  );

  // Call the next waiting customer
  const handleCallNext = () => {
    if (servingCustomer) {
      alert("Please complete the customer currently being served first.");
      return;
    }

    const nextCustomer = queue.find(
      (customer) => customer.status === "Waiting"
    );

    if (!nextCustomer) {
      alert("There are no customers waiting.");
      return;
    }

    setQueue((previousQueue) =>
      previousQueue.map((customer) =>
        customer.id === nextCustomer.id
          ? { ...customer, status: "Serving" }
          : customer
      )
    );
  };

  // Complete service
  const handleComplete = (id) => {
    setQueue((previousQueue) =>
      previousQueue.map((customer) =>
        customer.id === id
          ? { ...customer, status: "Completed" }
          : customer
      )
    );
  };

  // Cancel a queue
  const handleCancel = (id) => {
    setQueue((previousQueue) =>
      previousQueue.map((customer) =>
        customer.id === id
          ? { ...customer, status: "Cancelled" }
          : customer
      )
    );
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Dashboard Header */}
        <section className="dashboard-header">
          <div>
            <span className="section-tag">EMPLOYEE DASHBOARD</span>

            <h1>Queue Management</h1>

            <p>
              Manage customer queues and monitor banking services.
            </p>
          </div>

          <button
            className="call-next-btn"
            onClick={handleCallNext}
          >
            ▶ Call Next Customer
          </button>
        </section>

        {/* Statistics Cards */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon waiting-icon">
              ⏳
            </div>

            <div>
              <span>Waiting Customers</span>
              <strong>{waitingCustomers.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon serving-icon">
              👤
            </div>

            <div>
              <span>Currently Serving</span>
              <strong>
                {servingCustomer ? 1 : 0}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed-icon">
              ✓
            </div>

            <div>
              <span>Completed Today</span>
              <strong>{completedCustomers.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total-icon">
              📊
            </div>

            <div>
              <span>Total Customers</span>
              <strong>{queue.length}</strong>
            </div>
          </div>

        </section>

        {/* Currently Serving */}
        <section className="currently-serving-section">

          <div className="section-title">
            <h2>Currently Serving</h2>
            <span className="live-label">● LIVE</span>
          </div>

          {servingCustomer ? (
            <div className="serving-customer-card">

              <div className="serving-number">
                {servingCustomer.queueNumber}
              </div>

              <div className="serving-customer-info">
                <h3>{servingCustomer.customerName}</h3>
                <p>{servingCustomer.service}</p>
              </div>

              <button
                className="complete-btn"
                onClick={() =>
                  handleComplete(servingCustomer.id)
                }
              >
                ✓ Complete Service
              </button>

            </div>
          ) : (
            <div className="no-serving">
              <p>No customer is currently being served.</p>

              <span>
                Click "Call Next Customer" to start serving.
              </span>
            </div>
          )}

        </section>

        {/* Queue Table */}
        <section className="queue-management">

          <div className="section-title">
            <div>
              <h2>Customer Queue</h2>
              <p>
                View and manage all customer service requests.
              </p>
            </div>

            <span className="queue-count">
              {waitingCustomers.length} Waiting
            </span>
          </div>

          <div className="table-wrapper">

            <table>
              <thead>
                <tr>
                  <th>Queue No.</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {queue.map((customer) => (
                  <tr key={customer.id}>

                    <td>
                      <strong className="queue-number">
                        {customer.queueNumber}
                      </strong>
                    </td>

                    <td>{customer.customerName}</td>

                    <td>{customer.service}</td>

                    <td>{customer.time}</td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="action-cell">

                      {customer.status === "Waiting" && (
                        <button
                          className="cancel-btn"
                          onClick={() =>
                            handleCancel(customer.id)
                          }
                        >
                          Cancel
                        </button>
                      )}

                      {customer.status === "Serving" && (
                        <button
                          className="table-complete-btn"
                          onClick={() =>
                            handleComplete(customer.id)
                          }
                        >
                          Complete
                        </button>
                      )}

                      {(customer.status === "Completed" ||
                        customer.status === "Cancelled") && (
                        <span className="no-action">
                          —
                        </span>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Dashboard;