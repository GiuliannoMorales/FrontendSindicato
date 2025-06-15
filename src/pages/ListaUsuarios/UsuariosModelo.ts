export interface Usuario {
	id: string;
	nombre: string;
	apellido: string;
	imagenUrl?: string;
	roles: string[]; // Para lógica interna
	tipoCliente?: string; // Lo que se muestra y filtra
	estado?: 'Activo' | 'Inactivo' | 'Bloqueado';
	cantidadMesesDeuda?: number;
}
