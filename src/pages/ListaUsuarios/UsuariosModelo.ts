export interface Usuario {
	id: string;
	nombre: string;
	apellido: string;
	ci?: string;
	imagenUrl?: string;
	roles: string[];
	tipoCliente?: string;
	estado?: 'Activo' | 'Inactivo' | 'Bloqueado';
	cantidadMesesDeuda?: number;
}
