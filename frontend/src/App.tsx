import React from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import "./App.css";
import { Admin } from "./pages/admin/Admin";
import { Login } from "./pages/login/Login";
import { Faculty } from "./pages/faculty/Faculty";
import { Ta } from "./pages/ta/Ta";
import { Student } from "./pages/student/Student";
import { ProtectedRoute } from "./components/Route/ProtectedRoute";
import { AuthProvider } from "./provider/AuthProvider";
import { Query } from "./pages/Query";
import { AlertProvider } from "./components/Alert";

// Create routes using createBrowserRouter
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty",
    element: (
      <ProtectedRoute>
        <Faculty />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute>
        <Student />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ta",
    element: (
      <ProtectedRoute>
        <Ta />
      </ProtectedRoute>
    ),
  },
  {
    path: "/query",
    element: (
      <ProtectedRoute>
        <Query />
      </ProtectedRoute>
    ),
  },
]);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty"
              element={
                <ProtectedRoute>
                  <Faculty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <Student />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ta"
              element={
                <ProtectedRoute>
                  <Ta />
                </ProtectedRoute>
              }
            />
            <Route
              path="/query"
              element={
                <ProtectedRoute>
                  <Query />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
