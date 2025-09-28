import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { API_URL } from "../../shared/const";

const Dashboard = () => {
  // Hàm logout đơn giản là xóa token
  const [profile, setProfile] = useState<any>(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getProfile = async () => {
    const response = await axios.get(`${API_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setProfile(response.data.user);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getProfile();
    }
  }, []);

  return (
    <div>
      <h1>Dashboard - Your To-dos</h1>
      <p>Welcome {profile?.username}! You are logged in.</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard;
