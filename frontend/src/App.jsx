import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import {
  ProtectedRoute,
  RedirectAuthenticatedUser,
} from "./components/ProtectedRoute";

function App() {
  const { user, isCheckingAuth, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex  items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="size-64"
        top="5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-green-500"
        size="size-64"
        top="70%"
        left="80%"
        delay={0}
      />
      <FloatingShape
        color="bg-green-500"
        size="size-64"
        top="40%"
        left="-10%"
        delay={0}
      />

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignupPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
