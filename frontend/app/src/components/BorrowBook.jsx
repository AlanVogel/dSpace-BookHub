import React, { useEffect, useState }  from "react";
import { getBorrowedBooks, restoreBook } from "./Admin/Book";
import { getOrderStatus, UserAction } from "./libs/helpers"; 

function BorrowBook() {
  const [books, setBooks] = useState([]);
      
      useEffect(() => {
          const fetchUsers = async () => {
              const data = await getBorrowedBooks();
              if (Array.isArray(data)) {
                  setBooks(data);
              } else {
                  console.error("Invalid data structure from API:", data);
                  setBooks([]);
              }
          };
          fetchUsers();
      }, []);
  
      const handleReturnBook = (book) => {
          restoreBook(book);
      };

    return (
      <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 overflow-visible">
              <strong className="text-gray-700 font-medium">All Borrowed Books</strong>
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
                        <UserAction
                          onBorrow={() => handleReturnBook(book)} /> 
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