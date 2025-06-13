export interface Usuario {
	id: string;
	nombre: string;
	apellido: string;
	rol: string;
	imagenUrl?: string;
	estado: 'Activo' | 'Inactivo' | 'Bloqueado';
}
