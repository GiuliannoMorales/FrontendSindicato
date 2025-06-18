export interface CrearPagoParqueo
{
    idCliente: string,
    idParqueo: number,
    idCajero: string,
    montoPagado: number,
    meses: Date[],
}