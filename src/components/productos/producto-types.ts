export interface Producto {
  productoId: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precioVenta: number;
  costoReferencial?: number;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  grupo: {
    grupoId: number;
    nombre: string;
    linea: {
      lineaId: number;
      nombre: string;
    };
  };
  marca: {
    marcaId: number;
    nombre: string;
  };
  inventario: {
    inventarioId: number;
    cantidadActual: number;
    cantidadMinima: number;
  };
}
