export { useAuth } from "../contexts/AuthContext";

// export const useAuth = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   return {
//     isAuthenticated: !!user,
//     role: user?.role || null
//   };
// };
// 🔒 Important Suggestion: You can later improve this
//  by using a Context (AuthContext) for real-time
//  login/logout state instead of relying on localStorage every render.
