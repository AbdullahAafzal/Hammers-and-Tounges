import { Navigate, Outlet } from "react-router-dom";

const SellerGuard = () => {
  const token = localStorage.getItem("sellerToken");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default SellerGuard;
