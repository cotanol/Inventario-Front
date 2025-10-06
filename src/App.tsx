import { Route, Routes } from "react-router";
import LoginPage from "./pages/login";
import UnauthorizedPage from "./pages/unauthorized";
import ProtectedRoute from "./components/routes/protected-route";
import PublicRoute from "./components/routes/public-route";
import NotFoundPage from "./pages/not-found";
import CreateUserPage from "./pages/usuarios/create-user";
import ViewUsersPage from "./pages/usuarios/view-users";
import AppLayout from "./layout/layout";
import EditUserPage from "./pages/usuarios/edit-user";
import HomePage from "./pages/home/home";
import CreateMarcaPage from "./pages/marcas/create-marca";
import ViewMarcasPage from "./pages/marcas/view-marcas";
import EditMarcaPage from "./pages/marcas/edit-marca";

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
            <Route path="/usuarios/registrar" element={<CreateUserPage />} />
            <Route path="/usuarios/editar/:id" element={<EditUserPage />} />
            <Route path="/usuarios" element={<ViewUsersPage />} />
            <Route path="/marcas/registrar" element={<CreateMarcaPage />} />
            <Route path="/marcas/editar/:id" element={<EditMarcaPage />} />
            <Route path="/marcas" element={<ViewMarcasPage />} />
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
