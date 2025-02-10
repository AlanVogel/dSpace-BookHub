import Cookie from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const editUser = async (
    userId,
    user_name,
    password,
    is_superuser
    ) => {

    const payload = {
        user_name: user_name,
        password: password,
        is_superuser: is_superuser
    };

    try {
        const token = Cookie.get("access_token");
        const {data} = await axios.patch(`${BACKEND_URL}/update_user`, payload, 
        {
            params: {
                user_id: userId, 
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log("User successfully updated");
        return data;
    } catch (error) {
        if (error.response) {
            console.error("Validation Error Response:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            console.error("Request Error:", error.message);
        }
    }
};