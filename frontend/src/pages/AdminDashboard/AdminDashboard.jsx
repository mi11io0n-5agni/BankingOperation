
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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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
  // HANDLE UNAUTHORIZED ACCESS
  // ==========================================

  const handleUnauthorized = () => {
    localStorage.removeItem("coopbankToken");
    localStorage.removeItem("coopbankUser");

    navigate("/login", { replace: true });
  };

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("coopbankUser");

    return storedUser ? JSON.parse(storedUser) : null;
  };

  const currentUser = getCurrentUser();

  // ==========================================
  // FETCH EMPLOYEES
  // ==========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

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

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load employees."
        );
      }

      setEmployees(data.employees || []);
    } catch (error) {
      console.error("Fetch Employees Error:", error);

      setError(
        error.message || "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD EMPLOYEES
  // ==========================================

  useEffect(() => {
    // Only Admin can access this page
    if (!currentUser || currentUser.role !== "Admin") {
      navigate("/login", { replace: true });
      return;
    }

    fetchEmployees();
  }, []);

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

  // ==========================================
  // CREATE EMPLOYEE
  // ==========================================

  const handleCreateEmployee = async (event) => {
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create employee."
        );
      }

      setMessage("Employee created successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        service: "",
      });

      await fetchEmployees();
    } catch (error) {
      console.error("Create Employee Error:", error);

      setError(
        error.message || "Unable to create employee."
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            service,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update employee service."
        );
      }

      setMessage("Employee service updated successfully.");

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

  const handleDeleteEmployee = async (employee) => {
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete employee."
        );
      }

      setMessage("Employee deleted successfully.");

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

    navigate("/login", { replace: true });
  };

  return (
    <main className="admin-page">
      <section className="admin-container">

        {/* ================= HEADER ================= */}

        <div className="admin-header">
          <div>
            <span className="admin-tag">
              ADMINISTRATION
            </span>

            <h1>Employee Management</h1>

            <p>
              Welcome,{" "}
              <strong>
                {currentUser?.name || "Administrator"}
              </strong>
            </p>

            <p>
              Manage employees and assign banking services.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              className="refresh-btn"
              onClick={fetchEmployees}
              disabled={loading || actionLoading}
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

        {/* ================= STATISTICS ================= */}

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Total Employees</span>
            <strong>{employees.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Assigned Services</span>
            <strong>
              {
                new Set(
                  employees
                    .map((employee) => employee.service)
                    .filter(Boolean)
                ).size
              }
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Available Services</span>
            <strong>{SERVICES.length}</strong>
          </div>
        </div>

        {/* ================= ADD EMPLOYEE ================= */}

        <div className="add-employee-card">
          <div className="card-heading">
            <span>ADD EMPLOYEE</span>
            <h2>Create New Employee</h2>
          </div>

          <form onSubmit={handleCreateEmployee}>
            <div className="employee-form-grid">

              <div className="form-group">
                <label>Full Name</label>

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
                <label>Email Address</label>

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
                <label>Password</label>

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
                <label>Assigned Service</label>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select a service
                  </option>

                  {SERVICES.map((service) => (
                    <option
                      key={service}
                      value={service}
                    >
                      {service}
                    </option>
                  ))}
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
            <span>EMPLOYEES</span>
            <h2>Manage Bank Employees</h2>
          </div>

          {loading ? (
            <div className="admin-loading">
              Loading employees...
            </div>
          ) : employees.length === 0 ? (
            <div className="admin-empty">
              <div>👥</div>
              <h3>No Employees Found</h3>
              <p>
                Add your first employee using the form above.
              </p>
            </div>
          ) : (
            <div className="employee-table-wrapper">
              <table className="employee-table">

                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Assigned Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>

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

                      <td>{employee.email}</td>

                      <td>
                        <select
                          className="service-select"
                          value={employee.service || ""}
                          onChange={(event) =>
                            handleServiceChange(
                              employee._id,
                              event.target.value
                            )
                          }
                          disabled={actionLoading}
                        >
                          <option value="">
                            Select service
                          </option>

                          {SERVICES.map((service) => (
                            <option
                              key={service}
                              value={service}
                            >
                              {service}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteEmployee(employee)
                          }
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
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

export default AdminDashboard;
