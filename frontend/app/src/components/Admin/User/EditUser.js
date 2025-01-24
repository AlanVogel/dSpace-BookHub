import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const editUser = async (
    userId,
    password,
    ) => {

    const payload = {
        password: password
    };

    try {
        const {data} = await axios.patch(`${BACKEND_URL}/update_user`, payload, 
        {
            params: {
                user_id: userId, 
            },
            headers: {
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