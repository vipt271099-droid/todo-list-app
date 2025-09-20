import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import axios from "axios";
import Login from "./components/Login";

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

function Register() {
  return <h1>Register Page (to be implemented)</h1>;
}

function Dashboard() {
  // Hàm logout đơn giản là xóa token
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Dashboard - Your To-dos</h1>
      <p>Welcome! You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// --- Main App Component ---
function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
