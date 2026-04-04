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
import EditRolePage from "./pages/roles/edit-role";
import ViewRolesPage from "./pages/roles/view-roles";
import CreateRolePage from "./pages/roles/create-role";
import ViewPedidosPage from "./pages/pedidos/view-pedidos";
import CreatePedidoPage from "./pages/pedidos/create-pedido";
import EditPedidoPage from "./pages/pedidos/edit-pedido";
import CreateProveedorPage from "./pages/proveedores/create-proveedor";
import ViewProveedoresPage from "./pages/proveedores/view-proveedores";
import EditProveedorPage from "./pages/proveedores/edit-proveedor";
import CreateCompraPage from "./pages/compras/create-compra";
import ViewComprasPage from "./pages/compras/view-compras";
import EditCompraPage from "./pages/compras/edit-compra";
import RecibirCompraPage from "./pages/compras/recibir-compra";

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
          element={<PermissionRoute permisosRequeridos={["USUARIOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/usuarios/registrar" element={<CreateUserPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["USUARIOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/usuarios/editar/:id" element={<EditUserPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["USUARIOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/usuarios" element={<ViewUsersPage />} />
          </Route>
        </Route>

        {/* ROLES */}
        <Route
          element={<PermissionRoute permisosRequeridos={["ROLES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/roles/registrar" element={<CreateRolePage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["ROLES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/roles/editar/:id" element={<EditRolePage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["ROLES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/roles" element={<ViewRolesPage />} />
          </Route>
        </Route>

        {/* MARCAS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["MARCAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/marcas/registrar" element={<CreateMarcaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["MARCAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/marcas/editar/:id" element={<EditMarcaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["MARCAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/marcas" element={<ViewMarcasPage />} />
          </Route>
        </Route>

        {/* LINEAS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["LINEAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/lineas/registrar" element={<CreateLineaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["LINEAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/lineas/editar/:id" element={<EditLineaPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["LINEAS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/lineas" element={<ViewLineasPage />} />
          </Route>
        </Route>

        {/* GRUPOS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["GRUPOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/grupos/registrar" element={<CreateGrupoPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["GRUPOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/grupos/editar/:id" element={<EditGrupoPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["GRUPOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/grupos" element={<ViewGruposPage />} />
          </Route>
        </Route>

        {/* PRODUCTOS */}
        <Route
          element={<PermissionRoute permisosRequeridos={["PRODUCTOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/productos/registrar" element={<CreateProducto />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["PRODUCTOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/productos/editar/:id" element={<EditProducto />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["PRODUCTOS"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/productos" element={<ProductosIndex />} />
          </Route>
        </Route>

        {/* CLIENTES */}
        <Route
          element={<PermissionRoute permisosRequeridos={["CLIENTES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/clientes/registrar" element={<CreateClientePage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["CLIENTES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/clientes/editar/:id" element={<EditClientePage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["CLIENTES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/clientes" element={<ViewClientesPage />} />
          </Route>
        </Route>

        {/* VENDEDORES */}
        <Route
          element={<PermissionRoute permisosRequeridos={["VENDEDORES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route
              path="/vendedores/registrar"
              element={<CreateVendedorPage />}
            />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VENDEDORES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route
              path="/vendedores/editar/:id"
              element={<EditVendedorPage />}
            />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["VENDEDORES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/vendedores" element={<ViewVendedoresPage />} />
          </Route>
        </Route>

        {/* PEDIDOS */}
        <Route element={<PermissionRoute permisosRequeridos={["PEDIDOS"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/pedidos" element={<ViewPedidosPage />} />
          </Route>
        </Route>
        <Route element={<PermissionRoute permisosRequeridos={["PEDIDOS"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/pedidos/registrar" element={<CreatePedidoPage />} />
          </Route>
        </Route>
        <Route element={<PermissionRoute permisosRequeridos={["PEDIDOS"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/pedidos/editar/:id" element={<EditPedidoPage />} />
          </Route>
        </Route>

        {/* PROVEEDORES */}
        <Route
          element={<PermissionRoute permisosRequeridos={["PROVEEDORES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/proveedores" element={<ViewProveedoresPage />} />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["PROVEEDORES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route
              path="/proveedores/registrar"
              element={<CreateProveedorPage />}
            />
          </Route>
        </Route>
        <Route
          element={<PermissionRoute permisosRequeridos={["PROVEEDORES"]} />}
        >
          <Route element={<AppLayout />}>
            <Route
              path="/proveedores/editar/:id"
              element={<EditProveedorPage />}
            />
          </Route>
        </Route>

        {/* COMPRAS */}
        <Route element={<PermissionRoute permisosRequeridos={["COMPRAS"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/compras" element={<ViewComprasPage />} />
          </Route>
        </Route>
        <Route element={<PermissionRoute permisosRequeridos={["COMPRAS"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/compras/registrar" element={<CreateCompraPage />} />
          </Route>
        </Route>
        <Route element={<PermissionRoute permisosRequeridos={["COMPRAS"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/compras/editar/:id" element={<EditCompraPage />} />
          </Route>
        </Route>
        <Route element={<PermissionRoute permisosRequeridos={["COMPRAS"]} />}>
          <Route element={<AppLayout />}>
            <Route
              path="/compras/recibir/:id"
              element={<RecibirCompraPage />}
            />
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
