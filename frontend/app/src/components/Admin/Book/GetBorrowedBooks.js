import Cookie from "js-cookie"
import api from "../../../utils/api";

export const getBorrowedBooks = async () => {

    try {
        const token = Cookie.get("access_token");
        const { data } = await api.get("/borrowed_books", {
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