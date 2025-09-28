import React, { useState } from "react";
import axios from "axios";
import "../../App.css";
import { Link } from "react-router-dom";
import { Button, Input } from "reactstrap";
import { API_URL } from "../../shared/const";

// NOTE: Hardcoded API URL to resolve a build warning.
// In a production setup, this should be handled via environment variables.
const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {
    const errors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 3) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationErrors({ username: "", password: "" });

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);
      // Chuyển hướng đến dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username:
          </label>
          <Input
            autoFocus
            id="username"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 outline-none ${
              validationErrors.username
                ? "border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (validationErrors.username) {
                setValidationErrors((prev) => ({ ...prev, username: "" }));
              }
            }}
            placeholder="Enter your username"
            invalid={validationErrors.username !== ""}
          />
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.username}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password:
          </label>
          <Input
            invalid={validationErrors.password !== ""}
            id="password"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 outline-none ${
              validationErrors.password
                ? "border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            placeholder="Enter your password"
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <Button
          color="primary"
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>
        Don't have an account? <Link to="/register">Register</Link>
      </form>
    </div>
  );
};

export default Login;
