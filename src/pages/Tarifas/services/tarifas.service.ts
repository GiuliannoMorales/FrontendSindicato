import type { AxiosInstance, AxiosPromise } from "axios";
// import type { BackendResponse } from "../../../types/backendResponse"
import type { NewTarifa, Tarifa } from "../models/TarifasModel"
import type { ErrorResponse } from "../../../types/backendResponse";
import axios from "axios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export interface FiltroTarifas {
  tipoVehiculo?: string;
  tipoCliente?: string;
  montoMin?: number;
  montoMax?: number;
  fechaInicio?: string; // Formato ISO 8601: 'YYYY-MM-DDTHH:mm:ss'
  fechaFin?: string;    // Formato ISO 8601: 'YYYY-MM-DDTHH:mm:ss'
  modificadoPor?: string;
}

export const createTarifa = async (
  api: AxiosInstance,
  tarifaData: NewTarifa
): Promise<Tarifa> => {
  const axios1 = useAxiosPrivate()
  try {
    const response = await api.post<Tarifa>('tarifa', tarifaData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Extraer el mensaje de error del backend
      const errorData = error.response.data as ErrorResponse;
      const errorMessage = errorData.errors?.[0]?.message || errorData.message || "Error al crear tarifa";
      throw new Error(errorMessage);
    }
    throw new Error("Error desconocido al crear tarifa");
  }
};

export const getTarifasHistorial = async (api: AxiosInstance,): AxiosPromise<Array<Tarifa>> => {
  try {
    const response = await api.get('historial-tarifas');
    console.log("Respuesta del servicio:", response);
    return response;
  } catch (error) {
    console.error('Error en getTarifasHistorial:', error);
    throw error;
  }
}

export const filtrarTarifas = (filtros: FiltroTarifas, api: AxiosInstance): AxiosPromise<Tarifa[]> => {
  // Construir query params eliminando los undefined/empty
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  return api.get(`/historial-tarifas/filtrar?${params.toString()}`);
};

export const getLastTarifas = (api: AxiosInstance) : AxiosPromise<Tarifa[]> => {
  return api.get('/tarifa/vigentes')
}