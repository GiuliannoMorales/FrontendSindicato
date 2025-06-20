export const openVehiculosDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VehiculosDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("vehiculos")) {
        const store = db.createObjectStore("vehiculos", { keyPath: "id", autoIncrement: true });

        store.createIndex("placa", "placa", { unique: true });
        store.createIndex("tipo", "tipo");
        store.createIndex("marca", "marca");
        store.createIndex("modelo", "modelo");
        store.createIndex("color", "color");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al abrir la base de datos VehiculosDB");
  });
};

export const guardarVehiculo = async (vehiculo: {
  tipo: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  fotoDelantera: string;
  fotoTrasera: string;
}) => {
  const db = await openVehiculosDB();
  const transaction = db.transaction("vehiculos", "readwrite");
  const store = transaction.objectStore("vehiculos");

  const countRequest = store.count();

  return new Promise((resolve, reject) => {
    countRequest.onsuccess = () => {
      const count = countRequest.result;
      if (count >= 5) {
        reject("No se pueden guardar más de 5 vehículos.");
        return;
      }

      const addRequest = store.add(vehiculo);

      addRequest.onsuccess = () => {
        console.log("Vehículo guardado en VehiculosDB");
        resolve(true);
      };
      addRequest.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        if (error?.name === "ConstraintError") {
          reject("Ya existe un vehículo añadido con esa placa.");
        } else {
          console.error("Error desconocido al guardar el vehículo:", error);
          reject("Error al guardar el vehículo.");
        }
      };
    };

    countRequest.onerror = () => {
      console.error("Error al contar los vehículos");
      reject("Error al contar los vehículos");
    };
  });
};

export const actualizarVehiculo = async (
  id: number,
  vehiculo: {
    tipo: string;
    placa: string;
    marca: string;
    modelo: string;
    color: string;
    fotoDelantera: string;
    fotoTrasera: string;
  }
): Promise<void> => {
  const db = await openVehiculosDB();
  const transaction = db.transaction("vehiculos", "readwrite");
  const store = transaction.objectStore("vehiculos");

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (!existing) {
        reject("Vehículo no encontrado para actualizar.");
        return;
      }

      const updatedVehiculo = { ...vehiculo, id };

      const updateRequest = store.put(updatedVehiculo);

      updateRequest.onsuccess = () => {
        console.log("Vehículo actualizado correctamente.");
        resolve();
      };

      updateRequest.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        console.error("Error al actualizar el vehículo:", error);
        reject("Error al actualizar el vehículo.");
      };
    };

    getRequest.onerror = () => {
      reject("Error al buscar el vehículo para actualizar.");
    };
  });
};

