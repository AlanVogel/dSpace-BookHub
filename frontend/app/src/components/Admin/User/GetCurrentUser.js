import api from "../../../utils/api";

export const returnCurrentUser = async () => {
    try {
        const { data } = await api.get("/get_user", {
            headers: {
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