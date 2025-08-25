import AppRouter from "./routes/AppRouter.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
     <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
