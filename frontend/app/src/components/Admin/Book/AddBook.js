import Cookie from "js-cookie";
import { toast } from "react-toastify";
import api from "../../../utils/api";

export const addBook = async (
    author,
    title,
    topic,
    category,
    link
    ) => {

    if(!(author.length > 0)) {
        throw new Error("Author was not provided");
    }
    if(!(title.length > 0)) {
        throw new Error("Title was not provided");
    }
    if(!(topic.length > 0)) {
        throw new Error("Topic was not provided");
    }
    if(!(category.length > 0)) {
        throw new Error("Category was not provided");
    }
    if(!(link.length > 0)) {
        throw new Error("Category was not provided");
    }

    const payload = {
        author: author,
        title: title,
        topic: topic,
        category: category,
        link: link
    };

    try {
        const token = Cookie.get("access_token");
        const {data} = await api.post("/add_book", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        toast.success("Book successfully added!");
        return data;
    } catch (error) {
        if (error.response) {
            const errMsg = error.response.data?.detail || "Adding Book Error";
            toast.error(errMsg);
            console.error("Validation Error Response:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            toast.error("Request Error:", error.message);
            console.error("Request Error:", error.message);
        }
    }
};