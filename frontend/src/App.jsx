import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensePage } from "./pages/ExpensePage";
import { HomePage } from "./pages/HomePage";
import { IncomePage } from "./pages/IncomePage";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ShopPage } from "./pages/ShopPage";
import TestPage from "./pages/TestPage";
import { UpdateProfilePage } from "./pages/UpdateProfilePage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <div>
        <Header />
        <ResetPasswordPage />
      </div>
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
    path: "/shop",
    element: (
      <ProtectedRoute>
        <Header />
        <ShopPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/test",
    element: (
      <ProtectedRoute>
        <Header />
        <TestPage />
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
