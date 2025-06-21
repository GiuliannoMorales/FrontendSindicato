export interface Tarifa{
    id: string,
    tipoCliente: string,
    tipoVehiculo: string,
    monto: string,
    fechaInicio: string,
    nombreCompleto: string,
}

export interface NewTarifa{
    idAdministrador: string
    tipoVehiculo: string
    tipoCliente: string
    monto: string
}