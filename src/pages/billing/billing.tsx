import { useAuth } from "../../contexts/AuthContext";
import MyBillsListView from "../view/myBillsListView";
import ShopsBillsListView from "../view/shopsBillsListView";

const Billing = () => {
  const { user, role } = useAuth();
  if (role === "0") {
    return <ShopsBillsListView />;
  }

  if (role == "1") {
    return <MyBillsListView />;
  }

  return null;
};

export default Billing;
