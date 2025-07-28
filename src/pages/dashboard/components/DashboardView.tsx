import { useAuth } from "../../../auth/useAuth";
import AdminDashboard from "../../view/AdminDashboardView";
import Widget from "../../../components/Widgets/widget";

export default function DashboardView() {
  const { role } = useAuth();

  if (role === "1") {
    // console.log("admin Dashboard ");
    return <AdminDashboard />;
  }

  // Default: Superadmin dashboard
  return <Widget />;
}
