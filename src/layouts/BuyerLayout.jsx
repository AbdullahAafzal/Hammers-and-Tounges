import BuyerHeader from "../components/BuyerHeader";
import { Outlet } from "react-router-dom";

const BuyerLayout = () => (
  <>
    <BuyerHeader />
    <Outlet />
  </>
);

export default BuyerLayout;
