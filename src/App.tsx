import { Route, Routes } from "react-router";
import LoginPage from "./pages/login";
import UnauthorizedPage from "./pages/unauthorized";
import PermissionRoute from "./components/routes/permission-route";
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
import CreateVendedorPage from "./pages/vendedores/create-vendedor";
import ViewVendedoresPage from "./pages/vendedores/view-vendedores";
import EditVendedorPage from "./pages/vendedores/edit-vendedor";
import EditPerfilPage from "./pages/perfiles/edit-perfil";
import ViewPerfilesPage from "./pages/perfiles/view-perfiles";
import CreatePerfilPage from "./pages/perfiles/create-perfil";
import ViewPedidosPage from "./pages/pedidos/view-pedidos";
import CreatePedidoPage from "./pages/pedidos/create-pedido";
import EditPedidoPage from "./pages/pedidos/edit-pedido";

function App() {
  return (
    <>
      <Routes>
        {/** Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        {/** Rutas protegidas - Solo requiere autenticación */}
        <Route element={<PermissionRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Route>
        {/** Rutas protegidas por permisos */}

        {/* USUARIOS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_USUARIO"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/usuarios/registrar" element={<CreateUserPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_USUARIO"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/usuarios/editar/:id" element={<EditUserPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_USUARIOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/usuarios" element={<ViewUsersPage />} />
          </Route>
        </Route>

        {/* PERFILES */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_PERFIL"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/perfiles/registrar" element={<CreatePerfilPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_PERFIL"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/perfiles/editar/:id" element={<EditPerfilPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_PERFILES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/perfiles" element={<ViewPerfilesPage />} />
          </Route>
        </Route>

        {/* MARCAS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_MARCA"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/marcas/registrar" element={<CreateMarcaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_MARCA"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/marcas/editar/:id" element={<EditMarcaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_MARCAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/marcas" element={<ViewMarcasPage />} />
          </Route>
        </Route>

        {/* LINEAS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_LINEA"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/lineas/registrar" element={<CreateLineaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_LINEA"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/lineas/editar/:id" element={<EditLineaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_LINEAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/lineas" element={<ViewLineasPage />} />
          </Route>
        </Route>

        {/* GRUPOS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_GRUPO"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/grupos/registrar" element={<CreateGrupoPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_GRUPO"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/grupos/editar/:id" element={<EditGrupoPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_GRUPOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/grupos" element={<ViewGruposPage />} />
          </Route>
        </Route>

        {/* PRODUCTOS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_PRODUCTO"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/productos/registrar" element={<CreateProducto />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_PRODUCTO"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/productos/editar/:id" element={<EditProducto />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_PRODUCTOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/productos" element={<ProductosIndex />} />
          </Route>
        </Route>

        {/* CLIENTES */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_CLIENTE"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/clientes/registrar" element={<CreateClientePage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_CLIENTE"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/clientes/editar/:id" element={<EditClientePage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_CLIENTES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/clientes" element={<ViewClientesPage />} />
          </Route>
        </Route>

        {/* VENDEDORES */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CREAR_VENDEDOR"]} />}
        >
          <Route element={<AppLayout />}>
            <Route
              path="/vendedores/registrar"
              element={<CreateVendedorPage />}
            />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["EDITAR_VENDEDOR"]} />}
        >
          <Route element={<AppLayout />}>
            <Route
              path="/vendedores/editar/:id"
              element={<EditVendedorPage />}
            />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VER_VENDEDORES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/vendedores" element={<ViewVendedoresPage />} />
          </Route>
        </Route>

        {/* PEDIDOS */}
        <Route element={<PermissionRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/pedidos" element={<ViewPedidosPage />} />
          </Route>
        </Route>
        <Route element={<PermissionRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/pedidos/registrar" element={<CreatePedidoPage />} />
          </Route>
        </Route>
        <Route element={<PermissionRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/pedidos/editar/:id" element={<EditPedidoPage />} />
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
