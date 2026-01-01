import ManagerHeader from "../components/ManagerHeader";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => (
  <>
    <ManagerHeader />
    <Outlet />
  </>
);

export default ManagerLayout;
