import React, { useContext, useEffect, useState }  from "react";
import { OrderStatus, Action, Pagination, highlightText } from "./libs/helpers";
import { deleteBook, getBorrowedBooks, returnBooks } from "./Admin/Book";
import { SearchContext } from "./libs/helpers";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

function BookTable( {onEdit, onBorrow, getData} ) {
    const [books, setBooks] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {searchQuery} = useContext(SearchContext);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);


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

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            const data = await getBorrowedBooks();
            if (Array.isArray(data)) {
                setBorrowedBooks(data);
            } else {
                console.error("Invalid data structure from API:", data);
                setBorrowedBooks([]);
            }
        };
        fetchBorrowedBooks();
    }, []);

    useEffect(() => {
        if (books.length > 0 || borrowedBooks.length > 0) {
          const validBooks = Array.isArray(books) ? books : [0];
          const validBorrowedBooks = Array.isArray(borrowedBooks) ? borrowedBooks : [0];
          getData([validBooks.length, validBorrowedBooks.length]);
        }
      }, [books, borrowedBooks, getData]);

    const filteredBooks = books.filter((book) =>
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);
    const paginatedBooks = filteredBooks.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const openDialog = (book) => {
        setSelectedBook(book);
        setIsDialogOpen(true);
      };
      
    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedBook(null);
    };
      
    const handleEdit = (book) => {
        onEdit(book);
    };

    const handleBorrow = (book) => {
        onBorrow(book);
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
                     paginatedBooks.map((book, index) => (
                        <tr key={book.id}>
                            <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                            {/*<td>{index+1}</td>*/}
                            <td>{book.id}</td>
                            <td>{highlightText(book.author, searchQuery)}</td> 
                            <td><a href={book.link}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="underline underline-offset-4
                                    hover:text-blue-500">
                                {highlightText(book.title, searchQuery)}</a></td> 
                            <td>{highlightText(book.topic, searchQuery)}</td> 
                            <td>{highlightText(book.category, searchQuery)}</td>
                            <td>
                                <OrderStatus
                                    status={book.status}
                                    location={book.location}
                                    borrowedBy={book.borrowedBy}
                                    onClick={() => openDialog(book)}
                                />
                            </td>
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
            <Pagination
              currentPage={currentPage}
              totalItems={filteredBooks.length}
              rowsPerPage={rowsPerPage}
              onPageChange={(page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1); // Reset to the first page when rows per page changes
                }}
            />
        </div>
        {isDialogOpen && selectedBook && ( 
        <Dialog open={isDialogOpen} onClose={closeDialog} className="fixed z-10
          left-0 top-0 w-full h-full flex items-center justify-center bg-black/[0.4]">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border rounded-md bg-white p-12">
              <DialogTitle className="font-bold text-center md:text-2xl">Book Details</DialogTitle>
              <p>
                <strong className="mb-2 text-base font-medium">Location:</strong> {selectedBook.location}
              </p>
              {selectedBook.status === "UNAVAILABLE" && (
                <p>
                  <strong className="mb-2 text-base font-medium">Borrowed by:</strong> {selectedBook.borrowed_by || "Unknown"}
                </p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={closeDialog}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 
                   focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                   dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>)}
    </div>
  )
}

export default BookTable;