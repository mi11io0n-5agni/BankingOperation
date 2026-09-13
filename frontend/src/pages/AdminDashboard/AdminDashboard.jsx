
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const SERVICES = [
  "Account Opening",
  "Deposit",
  "Withdrawal",
  "Mobile Banking",
  "Account Harmonization",
  "Customer Support",
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [queues, setQueues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    service: "",
  });

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("coopbankToken");
  };

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getCurrentUser = () => {
    const storedUser =
      localStorage.getItem("coopbankUser");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  };

  const currentUser = getCurrentUser();

  // ==========================================
  // HANDLE UNAUTHORIZED ACCESS
  // ==========================================

  const handleUnauthorized = () => {
    localStorage.removeItem("coopbankToken");
    localStorage.removeItem("coopbankUser");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // FETCH EMPLOYEES
  // ==========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load employees."
        );
      }

      setEmployees(data.employees || []);
    } catch (error) {
      console.error(
        "Fetch Employees Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ALL QUEUES
  // ==========================================

  const fetchQueues = async () => {
    try {
      setQueueLoading(true);

      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/queues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load queues."
        );
      }

      setQueues(data.queues || []);
    } catch (error) {
      console.error(
        "Fetch Queues Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load queue statistics."
      );
    } finally {
      setQueueLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    if (
      !currentUser ||
      currentUser.role !== "Admin"
    ) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    fetchEmployees();
    fetchQueues();
  }, []);

  // ==========================================
  // REFRESH EVERYTHING
  // ==========================================

  const handleRefresh = async () => {
    setError("");
    setMessage("");

    await Promise.all([
      fetchEmployees(),
      fetchQueues(),
    ]);
  };

  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // CREATE EMPLOYEE
 

  const handleCreateEmployee = async (
    event
  ) => {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const token = getToken();

      const response = await fetch(
        "http://localhost:5000/api/admin/employees",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create employee."
        );
      }

      setMessage(
        "Employee created successfully."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        service: "",
      });

      await fetchEmployees();
    } catch (error) {
      console.error(
        "Create Employee Error:",
        error
      );

      setError(
        error.message ||
          "Unable to create employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // UPDATE EMPLOYEE SERVICE
  // ==========================================

  const handleServiceChange = async (
    employeeId,
    service
  ) => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/admin/employees/${employeeId}/service`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            service,
          }),
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update employee service."
        );
      }

      setMessage(
        "Employee service updated successfully."
      );

      await fetchEmployees();
    } catch (error) {
      console.error(
        "Update Employee Error:",
        error
      );

      setError(
        error.message ||
          "Unable to update employee service."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DELETE EMPLOYEE
  // ==========================================

  const handleDeleteEmployee = async (
    employee
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/admin/employees/${employee._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete employee."
        );
      }

      setMessage(
        "Employee deleted successfully."
      );

      await fetchEmployees();
    } catch (error) {
      console.error(
        "Delete Employee Error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("coopbankToken");
    localStorage.removeItem("coopbankUser");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // QUEUE STATISTICS
  // ==========================================

  const totalQueues = queues.length;

  const waitingQueues = queues.filter(
    (queue) =>
      queue.status?.toLowerCase() ===
      "waiting"
  ).length;

  const servingQueues = queues.filter(
    (queue) =>
      queue.status?.toLowerCase() ===
      "serving"
  ).length;

  const completedQueues = queues.filter(
    (queue) =>
      queue.status?.toLowerCase() ===
      "completed"
  ).length;

  // ==========================================
  // SERVICE STATISTICS
  // ==========================================

  const serviceStatistics = SERVICES.map(
    (service) => {
      const serviceQueues = queues.filter(
        (queue) =>
          queue.service === service
      );

      return {
        service,
        total: serviceQueues.length,

        waiting: serviceQueues.filter(
          (queue) =>
            queue.status?.toLowerCase() ===
            "waiting"
        ).length,

        serving: serviceQueues.filter(
          (queue) =>
            queue.status?.toLowerCase() ===
            "serving"
        ).length,

        completed: serviceQueues.filter(
          (queue) =>
            queue.status?.toLowerCase() ===
            "completed"
        ).length,
      };
    }
  );

  return (
    <main className="admin-page">

      <section className="admin-container">

        {/* ================= HEADER ================= */}

        <div className="admin-header">

          <div>

            <span className="admin-tag">
              ADMINISTRATION
            </span>

            <h1>
              Branch Management Dashboard
            </h1>

            <p>
              Welcome,{" "}
              <strong>
                {currentUser?.name ||
                  "Administrator"}
              </strong>
            </p>

            <p>
              Monitor queues, employees,
              and banking services.
            </p>

          </div>

          <div className="admin-header-actions">

            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={
                loading ||
                queueLoading ||
                actionLoading
              }
            >
              ↻ Refresh
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {/* ================= MESSAGES ================= */}

        {message && (
          <div className="admin-success">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* ================= QUEUE STATISTICS ================= */}

        <div className="dashboard-section">

          <div className="section-heading">

            <span>
              QUEUE OVERVIEW
            </span>

            <h2>
              Customer Queue Statistics
            </h2>

          </div>

          <div className="queue-stats">

            <div className="queue-stat-card total">
              <span>Total Queues</span>
              <strong>
                {queueLoading
                  ? "..."
                  : totalQueues}
              </strong>
            </div>

            <div className="queue-stat-card waiting">
              <span>Waiting</span>
              <strong>
                {queueLoading
                  ? "..."
                  : waitingQueues}
              </strong>
            </div>

            <div className="queue-stat-card serving">
              <span>Being Served</span>
              <strong>
                {queueLoading
                  ? "..."
                  : servingQueues}
              </strong>
            </div>

            <div className="queue-stat-card completed">
              <span>Completed</span>
              <strong>
                {queueLoading
                  ? "..."
                  : completedQueues}
              </strong>
            </div>

          </div>

        </div>

        {/* ================= SERVICE STATISTICS ================= */}

        <div className="service-overview-card">

          <div className="card-heading">

            <span>
              BANKING SERVICES
            </span>

            <h2>
              Queue Status by Service
            </h2>

          </div>

          {queueLoading ? (
            <div className="admin-loading">
              Loading queue statistics...
            </div>
          ) : (
            <div className="service-stat-grid">

              {serviceStatistics.map(
                (item) => (
                  <div
                    className="service-stat-card"
                    key={item.service}
                  >

                    <h3>
                      {item.service}
                    </h3>

                    <div className="service-total">
                      <span>Total</span>

                      <strong>
                        {item.total}
                      </strong>
                    </div>

                    <div className="service-status-row">

                      <span>
                        Waiting:
                        <strong>
                          {" "}
                          {item.waiting}
                        </strong>
                      </span>

                      <span>
                        Serving:
                        <strong>
                          {" "}
                          {item.serving}
                        </strong>
                      </span>

                      <span>
                        Completed:
                        <strong>
                          {" "}
                          {item.completed}
                        </strong>
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* ================= EMPLOYEE STATISTICS ================= */}

        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>
              Total Employees
            </span>

            <strong>
              {employees.length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>
              Assigned Services
            </span>

            <strong>
              {
                new Set(
                  employees
                    .map(
                      (employee) =>
                        employee.service
                    )
                    .filter(Boolean)
                ).size
              }
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>
              Available Services
            </span>

            <strong>
              {SERVICES.length}
            </strong>
          </div>

        </div>

        {/* ================= ADD EMPLOYEE ================= */}

        <div className="add-employee-card">

          <div className="card-heading">

            <span>
              ADD EMPLOYEE
            </span>

            <h2>
              Create New Employee
            </h2>

          </div>

          <form
            onSubmit={
              handleCreateEmployee
            }
          >

            <div className="employee-form-grid">

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter employee name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="employee@coopbank.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Assigned Service
                </label>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select a service
                  </option>

                  {SERVICES.map(
                    (service) => (
                      <option
                        key={service}
                        value={service}
                      >
                        {service}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            <button
              type="submit"
              className="add-employee-btn"
              disabled={actionLoading}
            >
              {actionLoading
                ? "Creating Employee..."
                : "+ Add Employee"}
            </button>

          </form>

        </div>

        {/* ================= EMPLOYEE LIST ================= */}

        <div className="employee-list-card">

          <div className="card-heading">

            <span>
              EMPLOYEES
            </span>

            <h2>
              Manage Bank Employees
            </h2>

          </div>

          {loading ? (

            <div className="admin-loading">
              Loading employees...
            </div>

          ) : employees.length === 0 ? (

            <div className="admin-empty">

              <div>👥</div>

              <h3>
                No Employees Found
              </h3>

              <p>
                Add your first employee
                using the form above.
              </p>

            </div>

          ) : (

            <div className="employee-table-wrapper">

              <table className="employee-table">

                <thead>

                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>
                      Assigned Service
                    </th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {employees.map(
                    (employee) => (

                      <tr
                        key={employee._id}
                      >

                        <td>

                          <div className="employee-name">

                            <div className="employee-avatar">

                              {employee.name
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <strong>
                              {employee.name}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {employee.email}
                        </td>

                        <td>

                          <select
                            className="service-select"
                            value={
                              employee.service ||
                              ""
                            }
                            onChange={(event) =>
                              handleServiceChange(
                                employee._id,
                                event.target.value
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >

                            <option value="">
                              Select service
                            </option>

                            {SERVICES.map(
                              (service) => (
                                <option
                                  key={service}
                                  value={service}
                                >
                                  {service}
                                </option>
                              )
                            )}

                          </select>

                        </td>

                        <td>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteEmployee(
                                employee
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;

