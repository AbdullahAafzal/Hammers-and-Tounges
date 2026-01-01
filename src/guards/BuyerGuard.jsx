import { Navigate, Outlet } from "react-router-dom";

const BuyerGuard = () => {
  const token = localStorage.getItem("buyerToken");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default BuyerGuard;