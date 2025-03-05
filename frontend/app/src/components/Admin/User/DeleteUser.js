import Cookie from "js-cookie";
import { toast } from "react-toastify";
import api from "../../../utils/api";

export const deleteUser = async ( User ) => {

    try {
        const token = Cookie.get("access_token");
        const {data} = await api.delete("/delete_user", 
        {
            params: {
                user_id: User.id, 
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        toast.success("User successfully deleted");
        return data;
    } catch (error) {
        if (error.response) {
            const errMsg = error.response.data?.detail || "Deleting User Error";
            toast.error(errMsg);
            console.error("Validation Error Response: ", error.response.data);
            console.error("Status: ", error.response.status);
        } else {
            toast.error("Request Error: ", error.message);
            console.error("Request Error:", error.message);
        }
    }
};