import SellerHeader from "../components/SellerHeader";
import { Outlet } from "react-router-dom";

const SellerLayout = () => (
  <>
    <SellerHeader />
    <Outlet />
  </>
);

export default SellerLayout;
