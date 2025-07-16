import AppRouter from "./routes/AppRouter.tsx";
import { AuthProvider } from "./contexts/AuthContext"; // optional
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
