import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { AnnouncementPage } from "./features/admin/pages/AnnouncementPage";
import { OverviewPage } from "./features/admin/pages/OverviewPage";
import { UsersPage } from "./features/admin/pages/UsersPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensePage } from "./pages/ExpensePage";
import { HomePage } from "./pages/HomePage";
import { IncomePage } from "./pages/IncomePage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { UpdateProfilePage } from "./pages/UpdateProfilePage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

const router = createBrowserRouter([
  {
    path: "/unauthorized",
    element: (
      <ProtectedRoute>
        <Layout>
          <UnauthorizedPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
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
        <PublicRoute>
          <Layout>
            <ResetPasswordPage />
          </Layout>
        </PublicRoute>
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
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredPermission="adminDashboard.view">
        <Layout>
          <AdminPage />
        </Layout>
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="overview" /> }, // Default
      { path: "overview", element: <OverviewPage /> },
      { path: "announcements", element: <AnnouncementPage /> },
      { path: "users", element: <UsersPage /> },
    ],
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
