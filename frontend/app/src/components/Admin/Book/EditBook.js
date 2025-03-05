import Cookie from "js-cookie";
import { toast } from "react-toastify";
import api from "../../../utils/api";

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
        const {data} = await api.patch("/update_book", payload, 
        {
            params: {
                book_id: bookID, 
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        toast.success("Book successfully updated");
        return data;
    } catch (error) {
        if (error.response) {
            const errMsg = error.response.data?.detail || "Editing Book Error";
            toast.error(errMsg);
            console.error("Validation Error Response: ", error.response.data);
            console.error("Status: ", error.response.status);
        } else {
            toast.error("Request Error: ", error.message);
            console.error("Request Error: ", error.message);
        }
    }
};