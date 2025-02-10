import React, { useEffect, useState }  from "react";
import { getBorrowedBooks } from "./Admin/Book";
import { getOrderStatus, BookAction } from "./libs/helpers"; 

function BorrowBook( {onReturn} ) {
  const [books, setBooks] = useState([]);
      
      useEffect(() => {
          const fetchBorrowedBooks = async () => {
              const data = await getBorrowedBooks();
              if (Array.isArray(data)) {
                  setBooks(data);
              } else {
                  console.error("Invalid data structure from API:", data);
                  setBooks([]);
              }
          };
          fetchBorrowedBooks();
      }, []);
  
      const handleReturnBook = (book) => {
        onReturn(book);
      };

    return (
      <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 overflow-visible">
              <strong className="text-gray-700 font-medium">All Borrowed Books</strong>
              <div className="mt-3 border-x rounded-sm border-gray-200">
                <table className="w-full text-gray-700">
                  <thead>
                    <tr className="font-bold">
                      <td>#</td>
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
                    books.map((book, index) => (
                      <tr key={book.id}>
                        <td>{index+1}</td>
                        <td>{book.book_id}</td>
                        <td>{book.author}</td> 
                        <td><a href={`https://${book.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-4
                              hover:text-blue-500">
                              {book.title}</a></td> 
                        <td>{book.topic}</td> 
                        <td>{book.category}</td>
                        <td>{book.location}</td>
                        <td>
                          <BookAction
                            onReturn={() => handleReturnBook(book)} /> 
                        </td>
                     </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
    )
}

export default BorrowBook