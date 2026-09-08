
import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const token = localStorage.getItem(
    "coopbankToken"
  );

  const storedUser = localStorage.getItem(
    "coopbankUser"
  );

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (!token || !storedUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );

    localStorage.removeItem("coopbankToken");
    localStorage.removeItem("coopbankUser");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // ADMIN ONLY ACCESS
  // ==========================================

  if (
    adminOnly &&
    user.role !== "Admin"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // ==========================================
  // PREVENT ADMIN FROM EMPLOYEE DASHBOARD
  // ==========================================

  if (
    !adminOnly &&
    user.role === "Admin"
  ) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
