import Cookie from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const editBook = async (
    bookID,
    author,
    title,
    topic,
    category,
    link
    ) => {

    const payload = {
        author: author,
        title: title,
        topic: topic,
        category: category,
        link: link
    };

    try {
        const token = Cookie.get("access_token");
        const {data} = await axios.patch(`${BACKEND_URL}/update_book`, payload, 
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
        console.log("Book successfully updated");
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