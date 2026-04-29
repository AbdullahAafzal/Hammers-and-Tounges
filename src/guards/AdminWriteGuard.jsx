import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminWriteGuard = () => {
  const role = String(useSelector((state) => state.auth?.user?.role) || "").toLowerCase();
  if (role === "finance") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Outlet />;
};

export default AdminWriteGuard;
