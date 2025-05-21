import api from "../../../api/axios"
import type { Tarifa } from "../models/TarifasModel"

export const createTarifa = (tarifaData : Tarifa) => {
    try {
        return api.post('tarifas', tarifaData)
    } catch (error) {
        console.error('error al crear tarifas', error)
        throw error
    }
}