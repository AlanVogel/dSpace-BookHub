import Cookie from "js-cookie"
import { toast } from "react-toastify";
import api from "../../../utils/api";

export const borrowBook = async ( 
    bookID, 
    location 
    ) => {

    const payload = {
        location: location
    };

    try {
        const token = Cookie.get("access_token");
        const { data } = await api.post("/borrow_book", payload, 
        {
            params: {
                book_id: bookID, 
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        toast.success("Book borrowed successfully!");
        return data;
    } catch (error) {
        if (error.response) {
            const errMsg = error.response.data?.detail || "Borrowing Book Error";
            toast.error(errMsg);
            console.error("Validation Error Response: ", error.response.data);
            console.error("Status: ", error.response.status);
        } else {
            toast.error("Request Error: ", error.message);
            console.error("Request Error: ", error.message);
        }
        return null;
    }
};