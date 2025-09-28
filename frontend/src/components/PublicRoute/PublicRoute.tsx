import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  // Nếu đã có token, chuyển hướng về dashboard
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  // Nếu chưa có token, cho phép truy cập trang public (login, register)
  return <>{children}</>;
};

export default PublicRoute;
