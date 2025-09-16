import { Route, Routes } from "react-router";
import LoginPage from "./pages/login";
import UnauthorizedPage from "./pages/unauthorized";
import HomePage from "./pages/home";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/routes/protected-route";
import PublicRoute from "./components/routes/public-route";
import NotFoundPage from "./pages/not-found";
import CreateUserPage from "./pages/create-user";
import ViewUsersPage from "./pages/view-users";
import AppLayout from "./layout/layout";

function App() {
  return (
    <>
      <Routes>
        {/** Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        {/** Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Route>
        {/** Rutas para administradores */}
        <Route
          element={<ProtectedRoute perfilesPermitidos={["administrador"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/create-user" element={<CreateUserPage />} />
            <Route path="/admin/view-users" element={<ViewUsersPage />} />
          </Route>
        </Route>
        {/** Rutas generales */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
