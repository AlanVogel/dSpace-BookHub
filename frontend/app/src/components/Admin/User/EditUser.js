import Cookie from "js-cookie";
import { toast } from "react-toastify";
import api from "../../../utils/api";

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
        const {data} = await api.patch("/update_user", payload, 
        {
            params: {
                user_id: userId, 
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        toast.success("User successfully updated");
        return data;
    } catch (error) {
        if (error.response) {
            const errMsg = error.response.data?.detail || "Editing User Error";
            toast.error(errMsg);
            console.error("Validation Error Response: ", error.response.data);
            console.error("Status: ", error.response.status);
        } else {
            toast.error("Request Error: ", error.message);
            console.error("Request Error: ", error.message);
        }
    }
};