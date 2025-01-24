import React, { useEffect, useState }  from "react";
import { getOrderStatus, Action } from "./libs/helpers";
import { deleteBook, returnBooks } from "./Admin/Book";

function BookTable( {onEdit} ) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const data = await returnBooks();
            if (Array.isArray(data)) {
                setBooks(data);
            } else {
                console.error("Invalid data structure from API:", data);
                setBooks([]);
            }
        };
        fetchBooks();
    }, []);

    const handleEdit = (book) => {
        onEdit(book);
    };

    const handleBorrow = (book) => {
        console.log("Borrowing:", book); // Perform borrow logic here
    };

    const handleDelete = (book) => {
        deleteBook(book);
        window.location.reload();
    };

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 overflow-visible">
        <strong className="text-gray-700 font-medium">All Books</strong>
        <div className="mt-3 border-x rounded-sm border-gray-200">
            <table className="w-full text-gray-700">
                <thead>
                    <tr className="font-bold">
                        <td>ID</td> 
                        <td>Author</td> 
                        <td className="expand">Title</td> 
                        <td>Topic</td> 
                        <td>Category</td>
                        <td>Status</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(books) && 
                     books.map((book) => (
                        <tr key={book.id}>
                            <td>#{book.id}</td>
                            <td>{book.author}</td> 
                            <td><a href={`https://${book.link}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="underline underline-offset-4
                                    hover:text-blue-500">
                                {book.title}</a></td> 
                            <td>{book.topic}</td> 
                            <td>{book.category}</td>
                            <td>{getOrderStatus(book.status)}</td>
                            <td>
                                <Action 
                                onBorrow={() => handleBorrow(book)}  
                                onEdit={() => handleEdit(book)}  
                                onDelete={() => handleDelete(book)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default BookTable;