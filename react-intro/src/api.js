// react-intro/src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5174';

export async function getRoutes(q = '') {
    const params = q ? { q } : {};
    const response = await axios.get(`${API_URL}/routes`, { params });
    return response.data;
}

export async function getRoute(id) {
    const response = await axios.get(`${API_URL}/routes/${id}`);
    return response.data;
}

export async function createRoute(route) {
    const response = await axios.post(`${API_URL}/routes`, route);
    return response.data;
}

export async function updateRoute(id, route) {
    const response = await axios.put(`${API_URL}/routes/${id}`, route);
    return response.data;
}

export async function deleteRoute(id) {
    await axios.delete(`${API_URL}/routes/${id}`);
}

export async function getCountries() {
    const response = await axios.get(`${API_URL}/countries`);
    return response.data;
}
