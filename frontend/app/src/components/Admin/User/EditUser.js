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
        hashed_password: password,
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
        toast.error(error.response.data?.detail);
        throw new Error(error.response?.data?.detail || "Editing User Error"); 
    }
};