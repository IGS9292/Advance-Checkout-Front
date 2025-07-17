import AppRouter from "./routes/AppRouter.tsx";
import { AuthProvider } from "./contexts/AuthContext"; // optional
import "./App.css";
// import { ShopProvider } from "./contexts/ShopContext.tsx";

function App() {
  return (
    <AuthProvider>
      {/* <ShopProvider> */}
      <AppRouter />
      {/* </ShopProvider> */}
    </AuthProvider>
  );
}

export default App;
