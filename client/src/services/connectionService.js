import axios from "axios";

const API = "http://localhost:5000/api/connections";

const getToken = () => localStorage.getItem("token");

export const searchUsers = (keyword) =>
  axios.get(`${API}/search?keyword=${keyword}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

export const sendRequest = (id) =>
  axios.post(`${API}/send/${id}`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

export const acceptRequest = (id) =>
  axios.put(`${API}/accept/${id}`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

export const getConnections = () =>
  axios.get(`${API}/my`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
