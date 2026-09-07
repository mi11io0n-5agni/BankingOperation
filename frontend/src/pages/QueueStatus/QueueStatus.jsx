import { useState } from "react";
import { Link } from "react-router-dom";
import "./QueueStatus.css";

const demoQueue = {
  "A-101": {
    queueNumber: "A-101",
    customerName: "Abebe Kebede",
    service: "Account Opening",
    status: "Waiting",
    peopleAhead: 5,
    estimatedWait: "15 minutes",
  },
  "A-102": {
    queueNumber: "A-102",
    customerName: "Hana Gemechu",
    service: "Deposit",
    status: "Serving",
    peopleAhead: 0,
    estimatedWait: "Now serving",
  },
  "A-103": {
    queueNumber: "A-103",
    customerName: "Mohammed Ali",
    service: "Mobile Banking",
    status: "Completed",
    peopleAhead: 0,
    estimatedWait: "Completed",
  },
};

function QueueStatus() {
  const [queueNumber, setQueueNumber] = useState("");
  const [queue, setQueue] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const number = queueNumber.trim().toUpperCase();

    setQueue(demoQueue[number] || null);
    setSearched(true);
  };

  const handleClear = () => {
    setQueueNumber("");
    setQueue(null);
    setSearched(false);
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <main className="queue-status-page">
      <section className="queue-status-container">

        {/* Page Heading */}
        <div className="status-heading">
          <span className="section-tag">QUEUE TRACKING</span>

          <h1>Check Your Queue Status</h1>

          <p>
            Enter your queue number to see your current position
            and service status.
          </p>
        </div>

        {/* Search Form */}
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
                setQueueNumber(event.target.value)
              }
              placeholder="Example: A-101"
              required
            />

            <button type="submit">
              Check Status
            </button>
          </div>

          <small>
            Enter the queue number printed on your ticket.
          </small>
        </form>

        {/* Result */}
        {searched && queue && (
          <div className="status-result">

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

            <div className="result-details">

              <div className="detail-item">
                <span>Customer</span>
                <strong>{queue.customerName}</strong>
              </div>

              <div className="detail-item">
                <span>Service</span>
                <strong>{queue.service}</strong>
              </div>

            </div>

            {/* Queue Position */}
            {queue.status === "Waiting" && (
              <div className="waiting-card">

                <div className="waiting-icon">
                  ⏳
                </div>

                <div>
                  <span>Customers Ahead</span>
                  <strong>{queue.peopleAhead}</strong>
                </div>

                <div>
                  <span>Estimated Wait</span>
                  <strong>{queue.estimatedWait}</strong>
                </div>

              </div>
            )}

            {/* Serving */}
            {queue.status === "Serving" && (
              <div className="serving-card">
                <div className="serving-icon">
                  ✓
                </div>

                <div>
                  <h3>It&apos;s Your Turn!</h3>
                  <p>
                    Please proceed to the service desk.
                  </p>
                </div>
              </div>
            )}

            {/* Completed */}
            {queue.status === "Completed" && (
              <div className="completed-card">
                <div className="completed-icon">
                  ✓
                </div>

                <div>
                  <h3>Service Completed</h3>
                  <p>
                    Your banking service has been completed.
                  </p>
                </div>
              </div>
            )}

            <button
              className="clear-btn"
              onClick={handleClear}
              type="button"
            >
              Check Another Queue
            </button>
          </div>
        )}

        {/* Not Found */}
        {searched && !queue && (
          <div className="not-found">

            <div className="not-found-icon">
              ?
            </div>

            <h2>Queue Number Not Found</h2>

            <p>
              We couldn&apos;t find that queue number.
              Please check your ticket and try again.
            </p>

            <button
              onClick={handleClear}
              type="button"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Demo Information */}
        {!searched && (
          <div className="demo-info">
            <strong>Demo queue numbers</strong>

            <p>
              Until the backend is connected, you can test
              the page using:
            </p>

            <div className="demo-numbers">
              <span>A-101</span>
              <span>A-102</span>
              <span>A-103</span>
            </div>
          </div>
        )}

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