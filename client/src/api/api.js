import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URI}/api`, // your backend URL
  withCredentials: true
});

export default api;
