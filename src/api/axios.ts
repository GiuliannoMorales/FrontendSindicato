import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTaW5kaWNhdG8gcGFycXVlbyBVTVNTIiwidXNlcklkIjoiMjIyMjIyMjItMjIyMi0yMjIyLTIyMjItMjIyMjIyMjIyMjIyIiwic3ViIjoiY2FqZXJvIiwicm9sZXMiOlsiQ0FKRVJPIl0sImlhdCI6MTc0OTY5NzAyNCwiZXhwIjoxNzUwMzAxODI0fQ.vd5voPjLHL17BWPMEnYCjC1T7_CMM3hDagvBPHKCBGY'
  },
  withCredentials: false,
 
});


export default api;