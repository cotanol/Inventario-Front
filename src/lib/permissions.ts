export const MODULE_PERMISSIONS = [
  "USUARIOS",
  "PRODUCTOS",
  "CLIENTES",
  "MARCAS",
  "LINEAS",
  "GRUPOS",
  "ROLES",
  "VENDEDORES",
  "PROVEEDORES",
  "COMPRAS",
  "PEDIDOS",
] as const;

export type ModulePermission = (typeof MODULE_PERMISSIONS)[number];

const LEGACY_PERMISSION_TO_MODULE: Record<string, ModulePermission> = {
  VER_USUARIOS: "USUARIOS",
  CREAR_USUARIO: "USUARIOS",
  EDITAR_USUARIO: "USUARIOS",
  ELIMINAR_USUARIO: "USUARIOS",

  VER_PERFILES: "ROLES",
  CREAR_PERFIL: "ROLES",
  EDITAR_PERFIL: "ROLES",
  ELIMINAR_PERFIL: "ROLES",

  VER_PRODUCTOS: "PRODUCTOS",
  CREAR_PRODUCTO: "PRODUCTOS",
  EDITAR_PRODUCTO: "PRODUCTOS",
  ELIMINAR_PRODUCTO: "PRODUCTOS",

  VER_CLIENTES: "CLIENTES",
  CREAR_CLIENTE: "CLIENTES",
  EDITAR_CLIENTE: "CLIENTES",
  ELIMINAR_CLIENTE: "CLIENTES",

  VER_MARCAS: "MARCAS",
  CREAR_MARCA: "MARCAS",
  EDITAR_MARCA: "MARCAS",
  ELIMINAR_MARCA: "MARCAS",

  VER_LINEAS: "LINEAS",
  CREAR_LINEA: "LINEAS",
  EDITAR_LINEA: "LINEAS",
  ELIMINAR_LINEA: "LINEAS",

  VER_GRUPOS: "GRUPOS",
  CREAR_GRUPO: "GRUPOS",
  EDITAR_GRUPO: "GRUPOS",
  ELIMINAR_GRUPO: "GRUPOS",

  VER_VENDEDORES: "VENDEDORES",
  CREAR_VENDEDOR: "VENDEDORES",
  EDITAR_VENDEDOR: "VENDEDORES",
  ELIMINAR_VENDEDOR: "VENDEDORES",

  VER_PROVEEDORES: "PROVEEDORES",
  CREAR_PROVEEDOR: "PROVEEDORES",
  EDITAR_PROVEEDOR: "PROVEEDORES",
  ELIMINAR_PROVEEDOR: "PROVEEDORES",

  VER_PEDIDOS: "PEDIDOS",
  CREAR_PEDIDO: "PEDIDOS",
  EDITAR_PEDIDO: "PEDIDOS",
  ELIMINAR_PEDIDO: "PEDIDOS",

  VER_COMPRAS: "COMPRAS",
  CREAR_COMPRA: "COMPRAS",
  EDITAR_COMPRA: "COMPRAS",
  ELIMINAR_COMPRA: "COMPRAS",
};

export function normalizePermission(permission: string): string {
  return LEGACY_PERMISSION_TO_MODULE[permission] ?? permission;
}

export function hasRequiredPermissions(
  userPermissions: string[],
  requiredPermissions: string[],
  requireAll = false,
): boolean {
  if (requiredPermissions.length === 0) {
    return true;
  }

  const normalizedUserPermissions = new Set(
    userPermissions.map(normalizePermission),
  );
  const normalizedRequiredPermissions = requiredPermissions.map(
    normalizePermission,
  );

  return requireAll
    ? normalizedRequiredPermissions.every((permission) =>
        normalizedUserPermissions.has(permission),
      )
    : normalizedRequiredPermissions.some((permission) =>
        normalizedUserPermissions.has(permission),
      );
}
