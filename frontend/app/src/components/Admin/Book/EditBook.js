import axios from "axios";
import { BACKEND_URL } from "../../../config";

export const editBook = async (
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
        console.log("Access Token:", token);
        const {data} = await axios.patch(`${BACKEND_URL}/update_book`, payload, 
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log("Book successfully added:", data);
        return data;
    } catch (error) {
        if (error.response) {
            console.error("Validation Error Response:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            console.error("Request Error:", error.message);
        }
    }
}