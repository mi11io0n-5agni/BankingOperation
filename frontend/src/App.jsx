import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import GetQueue from "./pages/GetQueue/GetQueue";
import QueueStatus from "./pages/QueueStatus/QueueStatus";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/get-queue"
          element={<GetQueue />}
        />

        <Route
          path="/queue-status"
          element={<QueueStatus />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;