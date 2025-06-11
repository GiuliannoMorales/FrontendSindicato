import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
	baseURL: "http://localhost:8080/api",
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

export default api;