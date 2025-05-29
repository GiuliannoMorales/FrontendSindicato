import type { AxiosPromise } from "axios"
import api from "../../../api/axios"
// import type { BackendResponse } from "../../../types/backendResponse"
import type { NewTarifa, Tarifa } from "../models/TarifasModel"

export interface FiltroTarifas {
  tipoVehiculo?: string;
  tipoCliente?: string;
  montoMin?: number;
  montoMax?: number;
  fechaInicio?: string; // Formato ISO 8601: 'YYYY-MM-DDTHH:mm:ss'
  fechaFin?: string;    // Formato ISO 8601: 'YYYY-MM-DDTHH:mm:ss'
  modificadoPor?: string;
}

export const createTarifa = (tarifaData : NewTarifa) : AxiosPromise<Tarifa> => {
    try {
        return api.post('tarifa', tarifaData)
    } catch (error) {
        console.error('error al crear tarifas', error)
        throw error
    }
}

export const getTarifasHistorial = async (): AxiosPromise<Array<Tarifa>> => {
  try {
    const response = await api.get('historial-tarifas');
    console.log("Respuesta del servicio:", response);
    return response;
  } catch (error) {
    console.error('Error en getTarifasHistorial:', error);
    throw error;
  }
}

export const filtrarTarifas = (filtros: FiltroTarifas): AxiosPromise<Tarifa[]> => {
  // Construir query params eliminando los undefined/empty
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  return api.get(`/historial-tarifas/filtrar?${params.toString()}`);
};