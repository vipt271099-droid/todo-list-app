import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Label, Spinner } from "reactstrap";
import { API_URL } from "../../shared/const";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register");
    setValidationErrors({
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    });
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      const data = await axios.post(`${API_URL}/api/auth/register`, formValues);
      console.log(data);
      toast.success("Register successfully");
      setLoading(false);
    } catch (error) {
      console.log((error as any)?.response?.data?.message, "sdfadf");
      toast.error((error as any)?.response?.data?.message);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    };
    let isValid = true;

    if (!formValues.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (!formValues.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!formValues.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    if (!formValues.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <Label for="username">Username</Label>
          <Input
            invalid={validationErrors.username !== ""}
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={formValues.username}
            onChange={(e) => {
              setFormValues({ ...formValues, username: e.target.value });
              if (validationErrors.username) {
                setValidationErrors((prev) => ({ ...prev, username: "" }));
              }
            }}
          />
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.username}
            </p>
          )}
        </div>
        <div className="mb-2">
          <Label for="email">Email</Label>
          <Input
            invalid={validationErrors.email !== ""}
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formValues.email}
            onChange={(e) => {
              setFormValues({ ...formValues, email: e.target.value });
              if (validationErrors.email) {
                setValidationErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.email}
            </p>
          )}
        </div>
        <div className="mb-2">
          <Label for="password">Password</Label>
          <Input
            invalid={validationErrors.password !== ""}
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={(e) => {
              setFormValues({ ...formValues, password: e.target.value });
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: "" }));
              }
              if (formValues.password !== formValues.confirmPassword) {
                setValidationErrors((prev) => ({
                  ...prev,
                  confirmPassword: "Passwords do not match",
                }));
              }
            }}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>
        <div className="mb-2">
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            invalid={validationErrors.confirmPassword !== ""}
            name="confirmPassword"
            type="password"
            placeholder="Enter your confirm password"
            value={formValues.confirmPassword}
            onChange={(e) => {
              setFormValues({ ...formValues, confirmPassword: e.target.value });
              if (validationErrors.confirmPassword) {
                setValidationErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
              }
              if (formValues.password !== formValues.confirmPassword) {
                setValidationErrors((prev) => ({
                  ...prev,
                  confirmPassword: "Passwords do not match",
                }));
              }
              if (formValues.password === formValues.confirmPassword) {
                setValidationErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
              }
            }}
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
        <Button type="submit" color="primary" disabled={loading}>
          {loading ? <Spinner size="sm" /> : ""}
          <span className="ms-2">
            {loading ? "Registering..." : "Register"}
          </span>
        </Button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
