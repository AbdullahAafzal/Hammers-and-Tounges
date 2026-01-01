import { Navigate, Outlet } from "react-router-dom";

const ManagerGuard = () => {
  const token = localStorage.getItem("managerToken");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ManagerGuard;
