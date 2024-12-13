import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const editBook = async (
    bookId,
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
        const {data} = await axios.patch(`${BACKEND_URL}/update_book`, payload, 
        {
            params: {
                book_id: bookId, 
            },
            headers: {
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