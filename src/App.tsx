import "./App.css";
import ResponsiveDrawer from "./components/Sidebar";
import { CustomThemeProvider } from "./utils/theme";
import Dashboard from "./pages/Dashboard";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import MasterDataGerbang from "./pages/DataGerbang";
import LoginScreen from "./pages/Login";
import { useLogin } from "./stores/login/useLogin.ts";
import React, { useEffect } from "react";
import LaluLintasTable from "./pages/LaluLintas";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const PublicRoute = ({ children, isAuthenticated }: PublicRouteProps) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return <>{children}</>;
};

function App() {
  const { isAuthenticated, isLoading } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && location.pathname !== "/login") {
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      } else if (isAuthenticated && location.pathname === "/") {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  if (isLoading) {
    return (
      <CustomThemeProvider>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>Loading...</div>
        </div>
      </CustomThemeProvider>
    );
  }

  return (
    <CustomThemeProvider>
      {isAuthenticated ? (
        <ResponsiveDrawer>
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laporan-lalin"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <LaluLintasTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/master-gerbang"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MasterDataGerbang />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/login"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <LoginScreen />
                </PublicRoute>
              }
            />

            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </ResponsiveDrawer>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </CustomThemeProvider>
  );
}

export default App;
