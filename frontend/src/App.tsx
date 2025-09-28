import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import axios from "axios";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";

// --- Login Component ---
// Di chuyển vào đây để giải quyết lỗi import
// --- Other Components ---
function Home() {
  return (
    <div>
      <h1>Welcome to the To-do List App</h1>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}

// --- Main App Component ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
