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
import CreateLineaPage from "./pages/lineas/create-linea";
import ViewLineasPage from "./pages/lineas/view-lineas";
import EditLineaPage from "./pages/lineas/edit-linea";
import CreateGrupoPage from "./pages/grupos/create-grupo";
import ViewGruposPage from "./pages/grupos/view-grupos";
import EditGrupoPage from "./pages/grupos/edit-grupo";
import ProductosIndex from "./pages/productos/view-productos";
import CreateProducto from "./pages/productos/create-producto";
import EditProducto from "./pages/productos/edit-producto";
import CreateClientePage from "./pages/clientes/create-cliente";
import ViewClientesPage from "./pages/clientes/view-clientes";
import EditClientePage from "./pages/clientes/edit-cliente";

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
            <Route path="/lineas/registrar" element={<CreateLineaPage />} />
            <Route path="/lineas/editar/:id" element={<EditLineaPage />} />
            <Route path="/lineas" element={<ViewLineasPage />} />
            <Route path="/grupos/registrar" element={<CreateGrupoPage />} />
            <Route path="/grupos/editar/:id" element={<EditGrupoPage />} />
            <Route path="/grupos" element={<ViewGruposPage />} />
            <Route path="/productos/registrar" element={<CreateProducto />} />
            <Route path="/productos/editar/:id" element={<EditProducto />} />
            <Route path="/productos" element={<ProductosIndex />} />
            <Route path="/clientes/registrar" element={<CreateClientePage />} />
            <Route path="/clientes/editar/:id" element={<EditClientePage />} />
            <Route path="/clientes" element={<ViewClientesPage />} />
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
