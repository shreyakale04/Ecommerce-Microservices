import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8101",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        // Don't send JWT for login/register
        if (
            token &&
            config.url !== "/auth/login" &&
            config.url !== "/auth/register"
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;