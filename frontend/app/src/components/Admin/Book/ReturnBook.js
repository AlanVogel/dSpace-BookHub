import Cookie from "js-cookie"
import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const restoreBook = async ( 
    bookID,
    location
    ) => {
    
    const payload = {
        location: location
    }

    try {
        const token = Cookie.get("access_token");
        const { data } = await axios.post(`${BACKEND_URL}/return_book`, payload,
        {
            params: {
                book_id: bookID, 
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
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