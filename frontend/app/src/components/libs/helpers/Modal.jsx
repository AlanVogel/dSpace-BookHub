import React, { useState, useEffect } from "react"
import { addBook, editBook } from "../../Admin/Book";

export const Modal = ({ closeModal, isEditMode, bookData }) => {
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [category, setCategory] = useState("");
    const [link, setLink] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditMode && bookData) {
            setAuthor(bookData.author || "");
            setTitle(bookData.title || "");
            setTopic(bookData.topic || "");
            setCategory(bookData.category || "");
            setLink(bookData.link || "");
        }
    }, [isEditMode, bookData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = isEditMode 
            ? await editBook(bookData.id, author, title, topic, category, link)
            : await addBook(author, title, topic, category, link);

            if (data){
                window.location.reload();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

  return (
    <div className="fixed z-10 left-0 top-0 w-full h-full flex items-center justify-center bg-black/[0.4]"
      onClick={closeModal}
    >
        <div className="rounded-md p-8 bg-white w-1/3 space-y-4"
        onClick={(e) => e.stopPropagation()}
        >
            <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-grey-900 md:text-2xl">
                { isEditMode ? "Edit Book" : "Add new book"} 
            </h1>
            <form className="space-y-4 md:space-y-6">
                <div>
                   <label htmlFor="author" className="block mb-2 text-sm font-medium">Author</label>
                   <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="Author name"  type="text" name="author" required={true}
                                 value={author} onChange={e => setAuthor(e.target.value)}/>
                </div>
                <div>
                   <label htmlFor="title" className="block mb-2 text-sm font-medium">Title</label>
                   <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="Book title"  type="text" name="title" required={true}
                                 value={title} onChange={e => setTitle(e.target.value)}/>
                </div>
                <div>
                   <label htmlFor="topic" className="block mb-2 text-sm font-medium">Topic</label>
                   <input  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="Topic" type="text" name="topic" required={true}
                                 value={topic} onChange={e => setTopic(e.target.value)}/>
                </div>
                <div>
                   <label htmlFor="category" className="block mb-2 text-sm font-medium">Category</label>
                   <input  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Category" type="text" name="category" required={true}
                                  value={category} onChange={e => setCategory(e.target.value)}/>
                </div>
                <div>
                   <label htmlFor="link" className="block mb-2 text-sm font-medium">Link</label>
                   <input  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="www.example.com" type="url" name="link" required={true}
                                  value={link} onChange={e => setLink(e.target.value)}/>
                </div>
                {error && <p style={{color: "red"}}>{error}</p>}
                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 
                focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" 
                 onClick={handleSubmit} >Submit</button>
            </form>
        </div>
    </div>
  )
}
