export interface VehiculosResponse {
	status: string;
	statusCode: number;
	message: string;
	data: Vehiculo[];
	errors?: Errores[];
}

export interface Vehiculo {
	idParqueo: number;
	placa: string;
	marca: string;
	tipo: string;
	modelo: string;
	color: string;
}

export interface EstadoCuentaResponse {
	status: string;
	statusCode: number;
	message: string;
	data: EstadoCuentaData[];
	errors?: Errores[];
}

export interface EstadoCuentaData {
	placaVehiculo: string;
	detallesMes: DetalleMes[];
	saldoTotalPendiente: number;
	ultimaActualizacion: string;
	tipoCliente: string;
	tipoVehiculo: string;
}

export interface DetalleMes {
	periodo: string;
	estado: string;
	monto: number;
	fechaPago?: string;
}

export interface Errores {
	message?: string;
	field: string;
	details?: string;
}
