import type { AxiosPromise } from "axios"
import api from "../../../api/axios"
import type { BackendResponse } from "../../../types/backendResponse"
import type { NewTarifa, Tarifa } from "../models/TarifasModel"

export const createTarifa = (tarifaData : NewTarifa) : AxiosPromise<BackendResponse<Tarifa>> => {
    try {
        return api.post('tarifas', tarifaData)
    } catch (error) {
        console.error('error al crear tarifas', error)
        throw error
    }
}

export const getTarifasHistorial = async (): AxiosPromise<BackendResponse<Tarifa>> => {
  try {
    const response = await api.get('historial-tarifas/filtrar');
    console.log("Respuesta del servicio:", response);
    return response;
  } catch (error) {
    console.error('Error en getTarifasHistorial:', error);
    throw error;
  }
}