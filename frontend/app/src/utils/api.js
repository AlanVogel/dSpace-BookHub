import axios from "axios";
import { BACKEND_URL } from "../config";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`, 
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401){
            api.post("/logout", {}).finally(() => {
                window.location.href = "/";
            });
        }
        return Promise.reject(error);
    }
);


export default api;