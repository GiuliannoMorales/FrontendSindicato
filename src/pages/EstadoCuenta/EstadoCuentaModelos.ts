export interface VehiculosActivosResponse {
	status: string;
	statusCode: number;
	message: string;
	data: VehiculoActivo[];
}

export interface VehiculoActivo {
	idParqueo: number;
	placa: string;
	tipoVehiculo: string;
}

export interface EstadoCuentaResponse {
	status: string;
	statusCode: number;
	message: string;
	data: EstadoCuentaData;
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
