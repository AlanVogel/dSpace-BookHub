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
        if (error.response) {
            const errMsg = error.response.data?.detail || "Updating Account Error";
            toast.error(errMsg);
            console.error("Validation Error Response: ", error.response.data);
            console.error("Status: ", error.response.status);
        } else {
            toast.error("Request Error: ", error.message);
            console.error("Request Error: ", error.message);
        }
    }
};