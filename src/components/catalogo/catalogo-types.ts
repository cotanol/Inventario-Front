export interface Marca {
  marcaId: number;
  nombre: string;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface Linea {
  lineaId: number;
  nombre: string;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface Grupo {
  grupoId: number;
  nombre: string;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  linea: {
    lineaId: number;
    nombre: string;
  };
}
