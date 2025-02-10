import Cookie from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const returnUsers = async () => {

    try {
        const token = Cookie.get("access_token");
        const { data } = await axios.get(`${BACKEND_URL}/get_users`, {
            withCredentials: true,

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        
        return data;
    } catch (error) {
        if (error.response) {
            console.error("Validation Error Response:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            console.error("Request Error:", error.message);
        }
        return null;
    }
};