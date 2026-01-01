import AdminHeader from "../components/AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <>
    <AdminHeader />
    <Outlet />
  </>
);

export default AdminLayout;
