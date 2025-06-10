export interface Usuario {
	id: number;
	nombre: string;
	apellido: string;
	ci: string;
	rol: string;
	imagenUrl?: string;
	estado: 'activo' | 'inactivo' | 'bloqueado';
}
