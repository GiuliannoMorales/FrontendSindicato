import axios from 'axios';

const api_url = import.meta.env.VITE_API_URL;

if (!api_url) {
	throw new Error('VITE_API_URL no está definida en las variables de entorno');
}

const api = axios.create({
	baseURL: api_url,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: false,
});

export default api;
