import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET ALL QUEUES
  // ==========================================

  const fetchQueues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/queues"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load queues"
        );
      }

      setQueues(data.queues || []);
    } catch (error) {
      console.error("Fetch Queues Error:", error);

      setError(
        "Unable to load queue data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD QUEUES WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchQueues();
  }, []);

  // ==========================================
  // UPDATE QUEUE STATUS
  // ==========================================

  const updateQueueStatus = async (id, status) => {
    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/queues/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update queue"
        );
      }

      // Reload the queue list after update
      await fetchQueues();
    } catch (error) {
      console.error("Update Queue Error:", error);

      setError(
        error.message ||
          "Unable to update queue status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FIND CURRENT SERVING CUSTOMER
  // ==========================================

  const servingQueue = queues.find(
    (queue) => queue.status === "Serving"
  );

  // ==========================================
  // FIND NEXT WAITING CUSTOMER
  // ==========================================

  const nextWaitingQueue = [...queues]
    .filter((queue) => queue.status === "Waiting")
    .sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    )[0];

  // ==========================================
  // CALL NEXT CUSTOMER
  // ==========================================

  const handleCallNext = async () => {
    if (!nextWaitingQueue) {
      alert("There are no waiting customers.");
      return;
    }

    if (servingQueue) {
      alert(
        `Customer ${servingQueue.queueNumber} is currently being served. Complete that service first.`
      );
      return;
    }

    await updateQueueStatus(
      nextWaitingQueue._id,
      "Serving"
    );
  };

  // ==========================================
  // COMPLETE CURRENT SERVICE
  // ==========================================

  const handleComplete = async () => {
    if (!servingQueue) {
      alert("There is no customer currently being served.");
      return;
    }

    await updateQueueStatus(
      servingQueue._id,
      "Completed"
    );
  };

  // ==========================================
  // CANCEL QUEUE
  // ==========================================

  const handleCancel = async (queue) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel queue ${queue.queueNumber}?`
    );

    if (!confirmed) {
      return;
    }

    await updateQueueStatus(
      queue._id,
      "Cancelled"
    );
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const waitingCount = queues.filter(
    (queue) => queue.status === "Waiting"
  ).length;

  const servingCount = queues.filter(
    (queue) => queue.status === "Serving"
  ).length;

  const completedCount = queues.filter(
    (queue) => queue.status === "Completed"
  ).length;

  const cancelledCount = queues.filter(
    (queue) => queue.status === "Cancelled"
  ).length;

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <main className="dashboard-page">

      {/* ================= HEADER ================= */}

      <section className="dashboard-container">

        <div className="dashboard-header">

          <div>
            <span className="section-tag">
              EMPLOYEE DASHBOARD
            </span>

            <h1>Queue Management</h1>

            <p>
              Manage customer queues and banking
              service operations.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchQueues}
            disabled={loading || actionLoading}
          >
            ↻ Refresh
          </button>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <div className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>Waiting</span>
              <strong>{waitingCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              📞
            </div>

            <div>
              <span>Serving</span>
              <strong>{servingCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ✕
            </div>

            <div>
              <span>Cancelled</span>
              <strong>{cancelledCount}</strong>
            </div>
          </div>

        </div>

        {/* ================= CURRENT CUSTOMER ================= */}

        <div className="current-service-card">

          <div className="current-service-header">

            <div>
              <span className="section-tag">
                CURRENT SERVICE
              </span>

              <h2>
                {servingQueue
                  ? servingQueue.queueNumber
                  : "No Customer"}
              </h2>
            </div>

            {servingQueue && (
              <span className="status-badge serving">
                Serving
              </span>
            )}

          </div>

          {servingQueue ? (
            <div className="current-customer">

              <div className="customer-info">

                <div className="customer-avatar">
                  {servingQueue.customerName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <span>Customer</span>

                  <strong>
                    {servingQueue.customerName}
                  </strong>
                </div>

              </div>

              <div className="customer-service">

                <span>Service</span>

                <strong>
                  {servingQueue.service}
                </strong>

              </div>

              <button
                className="complete-btn"
                onClick={handleComplete}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Updating..."
                  : "✓ Complete Service"}
              </button>

            </div>
          ) : (
            <div className="no-current-customer">

              <div className="empty-icon">
                ⏳
              </div>

              <div>
                <h3>No Customer Being Served</h3>

                <p>
                  Call the next waiting customer to
                  begin a service.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* ================= CALL NEXT ================= */}

        <div className="next-customer-section">

          <div>
            <span className="section-tag">
              NEXT CUSTOMER
            </span>

            {nextWaitingQueue ? (
              <>
                <h2>
                  {nextWaitingQueue.queueNumber}
                </h2>

                <p>
                  {nextWaitingQueue.customerName}
                  {" • "}
                  {nextWaitingQueue.service}
                </p>
              </>
            ) : (
              <h2>
                No Waiting Customers
              </h2>
            )}
          </div>

          <button
            className="call-next-btn"
            onClick={handleCallNext}
            disabled={
              actionLoading ||
              !nextWaitingQueue ||
              !!servingQueue
            }
          >
            📞 Call Next Customer
          </button>

        </div>

        {/* ================= QUEUE TABLE ================= */}

        <div className="queue-table-card">

          <div className="table-header">

            <div>
              <span className="section-tag">
                TODAY&apos;S QUEUE
              </span>

              <h2>Customer Queue</h2>
            </div>

            <span className="queue-count">
              {queues.length} Customers
            </span>

          </div>

          {loading ? (
            <div className="dashboard-loading">
              Loading queue data...
            </div>
          ) : queues.length === 0 ? (
            <div className="dashboard-empty">

              <div className="empty-icon">
                📋
              </div>

              <h3>No Queue Records</h3>

              <p>
                Customers who register for a queue
                will appear here.
              </p>

            </div>
          ) : (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Queue</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {queues.map((queue) => (
                    <tr key={queue._id}>

                      <td>
                        <strong className="queue-number">
                          {queue.queueNumber}
                        </strong>
                      </td>

                      <td>
                        {queue.customerName}
                      </td>

                      <td>
                        {queue.service}
                      </td>

                      <td>
                        {formatTime(
                          queue.createdAt
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            queue.status
                          )}`}
                        >
                          {queue.status}
                        </span>
                      </td>

                      <td>

                        {queue.status === "Waiting" && (
                          <button
                            className="table-action call"
                            onClick={() =>
                              updateQueueStatus(
                                queue._id,
                                "Serving"
                              )
                            }
                            disabled={
                              actionLoading ||
                              !!servingQueue
                            }
                          >
                            Call
                          </button>
                        )}

                        {queue.status === "Serving" && (
                          <button
                            className="table-action complete"
                            onClick={() =>
                              updateQueueStatus(
                                queue._id,
                                "Completed"
                              )
                            }
                            disabled={actionLoading}
                          >
                            Complete
                          </button>
                        )}

                        {(queue.status === "Waiting" ||
                          queue.status === "Serving") && (
                          <button
                            className="table-action cancel"
                            onClick={() =>
                              handleCancel(queue)
                            }
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        )}

                        {queue.status === "Completed" && (
                          <span className="action-done">
                            Done
                          </span>
                        )}

                        {queue.status === "Cancelled" && (
                          <span className="action-done">
                            Cancelled
                          </span>
                        )}

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default Dashboard;