import { useAuth } from "../../contexts/AuthContext";
import PaymentGatewayList from "../view/PaymentGatewayListView";
import { Box, Stack } from "@mui/material";
import PaymentMethodShop from "./components/PaymentMethodShop";

const PaymentGateway = () => {
  const { role } = useAuth();

  if (role == "0") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="88vh"
        overflow="hidden"
      >
        <Stack width="100%" height="100%">
          <PaymentGatewayList />
        </Stack>
      </Box>
    );
  }

  if (role == "1") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="88vh"
        overflow="hidden"
      >
        <Stack width="100%" height="100%">
          <PaymentMethodShop />
        </Stack>
      </Box>
    );
  }

  return null;
};

export default PaymentGateway;
