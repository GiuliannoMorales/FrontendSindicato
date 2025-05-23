import { openVehiculosDB } from "../../../bd/vehiculosBD";

export const getAllVehiculos = async (): Promise<any[]> => {
    const db = await openVehiculosDB();
    const transaction = db.transaction("vehiculos", "readonly");
    const store = transaction.objectStore("vehiculos");

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error("Error al leer vehículos desde VehiculosDB");
            reject(request.error);
        };
    });
};

export const deleteVehiculoById = async (id: number): Promise<void> => {
    const db = await openVehiculosDB();
    const transaction = db.transaction("vehiculos", "readwrite");
    const store = transaction.objectStore("vehiculos");

    return new Promise((resolve, reject) => {
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            console.error("Error al eliminar vehículo");
            reject(request.error);
        };
    });
};

export const clearVehiculos = async (): Promise<void> => {
    const db = await openVehiculosDB();
    const transaction = db.transaction("vehiculos", "readwrite");
    const store = transaction.objectStore("vehiculos");

    return new Promise((resolve, reject) => {
        const request = store.clear();

        request.onsuccess = () => {
            console.log("Vehículos limpiados de la base de datos local.");
            resolve();
        };

        request.onerror = () => {
            console.error("Error al limpiar vehículos.");
            reject(request.error);
        };
    });
};

export const borrarVehiculosDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase("VehiculosDB");

    deleteRequest.onsuccess = () => {
      console.log("Base de datos VehiculosDB borrada exitosamente");
      resolve();
    };

    deleteRequest.onerror = () => {
      console.error("Error al borrar la base de datos VehiculosDB");
      reject("Error al borrar la base de datos VehiculosDB");
    };

    deleteRequest.onblocked = () => {
      console.warn("El borrado de la base de datos está bloqueado");
    };
  });
};

