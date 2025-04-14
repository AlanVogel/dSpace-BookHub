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
        toast.error(error.response.data?.detail);
        throw new Error(error.response?.data?.detail || "Updating Book Failed");
    }
};