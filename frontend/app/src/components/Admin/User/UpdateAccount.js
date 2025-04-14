import { toast } from "react-toastify";
import api from "../../../utils/api";

export const updateAccount = async (
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
        const {data} = await api.patch("/update_account", payload, 
        {
            params: {
                user_id: userId, 
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        toast.success("Account successfully updated");
        return data;
    } catch (error) {
        toast.error(error.response.data?.detail);
        throw new Error(error.response?.data?.detail || "Updating Account Error");
    }
};