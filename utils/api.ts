import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || "http://localhost:5000",
});

export default api;
