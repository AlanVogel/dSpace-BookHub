import Cookie from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const deleteBook = async ( Book ) => {

    try {
        const token = Cookie.get("access_token");
        const {data} = await axios.delete(`${BACKEND_URL}/delete_book`, 
        {
            params: {
                book_id: Book.id, 
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log("Book successfully deleted");
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