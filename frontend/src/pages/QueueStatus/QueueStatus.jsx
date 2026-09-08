import { useState } from "react";
import { Link } from "react-router-dom";
import "./QueueStatus.css";

function QueueStatus() {
  const [queueNumber, setQueueNumber] = useState("");
  const [queue, setQueue] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // CHECK QUEUE STATUS
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const number = queueNumber.trim().toUpperCase();

    if (!number) {
      return;
    }

    setLoading(true);
    setSearched(false);
    setQueue(null);
    setErrorMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/queues/${number}`
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || "Queue number not found."
        );

        setSearched(true);
        return;
      }

      setQueue(data);
      setSearched(true);
    } catch (error) {
      console.error("Queue Status Error:", error);

      setErrorMessage(
        "Unable to connect to the server. Please make sure the backend is running."
      );

      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClear = () => {
    setQueueNumber("");
    setQueue(null);
    setSearched(false);
    setErrorMessage("");
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <main className="queue-status-page">
      <section className="queue-status-container">

        {/* ================= HEADING ================= */}

        <div className="status-heading">
          <span className="section-tag">
            QUEUE TRACKING
          </span>

          <h1>Check Your Queue Status</h1>

          <p>
            Enter your queue number to see your current
            position and service status.
          </p>
        </div>

        {/* ================= SEARCH ================= */}

        <form
          className="status-search"
          onSubmit={handleSubmit}
        >
          <label htmlFor="queueNumber">
            Queue Number
          </label>

          <div className="search-row">
            <input
              id="queueNumber"
              type="text"
              value={queueNumber}
              onChange={(event) =>
                setQueueNumber(event.target.value.toUpperCase())
              }
              placeholder="Example: A-001"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>

          <small>
            Enter the queue number printed on your ticket.
          </small>
        </form>

        {/* ================= RESULT ================= */}

        {searched && queue && (
          <div className="status-result">

            {/* RESULT HEADER */}

            <div className="result-header">
              <div>
                <span>Your Queue Number</span>

                <h2>{queue.queueNumber}</h2>
              </div>

              <span
                className={`status-badge ${getStatusClass(
                  queue.status
                )}`}
              >
                {queue.status}
              </span>
            </div>

            {/* DETAILS */}

            <div className="result-details">

              <div className="detail-item">
                <span>Customer</span>

                <strong>
                  {queue.customerName}
                </strong>
              </div>

              <div className="detail-item">
                <span>Service</span>

                <strong>
                  {queue.service}
                </strong>
              </div>

              {queue.phone && (
                <div className="detail-item">
                  <span>Phone</span>

                  <strong>
                    {queue.phone}
                  </strong>
                </div>
              )}

              <div className="detail-item">
                <span>Registered</span>

                <strong>
                  {new Date(
                    queue.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </div>

            </div>

            {/* ================= WAITING ================= */}

            {queue.status === "Waiting" && (
              <div className="waiting-card">

                <div className="waiting-icon">
                  ⏳
                </div>

                <div>
                  <span>Queue Status</span>

                  <strong>
                    Waiting
                  </strong>
                </div>

                <div>
                  <span>Estimated Wait</span>

                  <strong>
                    Please wait
                  </strong>
                </div>

              </div>
            )}

            {/* ================= SERVING ================= */}

            {queue.status === "Serving" && (
              <div className="serving-card">

                <div className="serving-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    It&apos;s Your Turn!
                  </h3>

                  <p>
                    Please proceed to the service desk.
                  </p>
                </div>

              </div>
            )}

            {/* ================= COMPLETED ================= */}

            {queue.status === "Completed" && (
              <div className="completed-card">

                <div className="completed-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Service Completed
                  </h3>

                  <p>
                    Your banking service has been completed.
                  </p>
                </div>

              </div>
            )}

            {/* ================= CANCELLED ================= */}

            {queue.status === "Cancelled" && (
              <div className="completed-card">

                <div className="completed-icon">
                  ✕
                </div>

                <div>
                  <h3>
                    Queue Cancelled
                  </h3>

                  <p>
                    This queue has been cancelled.
                  </p>
                </div>

              </div>
            )}

            {/* CLEAR BUTTON */}

            <button
              className="clear-btn"
              onClick={handleClear}
              type="button"
            >
              Check Another Queue
            </button>

          </div>
        )}

        {/* ================= NOT FOUND ================= */}

        {searched && !queue && (
          <div className="not-found">

            <div className="not-found-icon">
              ?
            </div>

            <h2>
              Queue Number Not Found
            </h2>

            <p>
              {errorMessage ||
                "We couldn't find that queue number. Please check your ticket and try again."}
            </p>

            <button
              onClick={handleClear}
              type="button"
            >
              Try Again
            </button>

          </div>
        )}

        {/* ================= DEMO INFO ================= */}

        {!searched && (
          <div className="demo-info">

            <strong>
              Example queue numbers
            </strong>

            <p>
              Create a queue from the Get Queue page,
              then enter its number here.
            </p>

            <div className="demo-numbers">
              <span>A-001</span>
              <span>A-002</span>
              <span>A-003</span>
            </div>

          </div>
        )}

        {/* ================= BACK LINK ================= */}

        <div className="back-link">
          <Link to="/get-queue">
            ← Get a Queue Number
          </Link>
        </div>

      </section>
    </main>
  );
}

export default QueueStatus;