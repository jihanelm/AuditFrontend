import axios from "axios";

const API_URL = "http://localhost:8000";

export const addFlux = (ips, ports) => {
    return axios.post(`${API_URL}/flux/`, { ips, ports });
};

export const closeFlux = (fluxId) => {
    return axios.put(`${API_URL}/flux/${fluxId}/close`);
};
