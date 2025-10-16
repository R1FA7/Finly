import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensePage } from "./pages/ExpensePage";
import { HomePage } from "./pages/HomePage";
import { IncomePage } from "./pages/IncomePage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { UpdateProfilePage } from "./pages/UpdateProfilePage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Layout>
          <LandingPage />
        </Layout>
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Layout>
          <LoginPage />
        </Layout>
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <div>
        <Layout>
          <ResetPasswordPage />
        </Layout>
      </div>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Layout>
          <HomePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <ProtectedRoute>
        <Layout>
          <VerifyEmailPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <DashboardPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/income",
    element: (
      <ProtectedRoute>
        <Layout>
          <IncomePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/expense",
    element: (
      <ProtectedRoute>
        <Layout>
          <ExpensePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/updateProfile",
    element: (
      <ProtectedRoute>
        <Layout>
          <UpdateProfilePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);
function App() {
  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
