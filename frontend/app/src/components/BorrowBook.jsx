import React, { useContext, useEffect, useState }  from "react";
import { getBorrowedBooks, returnBooks } from "./Admin/Book";
import { BookAction, highlightText, Pagination, SearchContext } from "./libs/helpers"; 

function BorrowBook( {onReturn, getData} ) {
  const [totalBooks, setTotalBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {searchQuery} = useContext(SearchContext);
      
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const borrowBooksData = await getBorrowedBooks();
      if (Array.isArray(borrowBooksData)) {
        setBorrowedBooks(borrowBooksData);
      } else {
        console.error("Invalid data structure from API:", borrowBooksData);
        setBorrowedBooks([]);
      }
    };
    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const allBooksData = await returnBooks();
      if (Array.isArray(allBooksData)) {
        setTotalBooks(allBooksData);
      } else {
        console.error("Invalid data structure from API:", allBooksData);
        setTotalBooks([]);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (totalBooks.length > 0 || borrowedBooks.length > 0) {
      const validBooks = Array.isArray(totalBooks) ? totalBooks : [0];
      const validBorrowedBooks = Array.isArray(borrowedBooks) ? borrowedBooks : [0];
      getData([validBooks.length, validBorrowedBooks.length]);
    }
  }, [totalBooks, borrowedBooks, getData]);

  const filteredBooks = borrowedBooks.filter((book) =>
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
                    {Array.isArray(borrowedBooks) && 
                    paginatedBooks.map((book, index) => (
                      <tr key={book.id}>
                        <td>{(currentPage-1) * rowsPerPage + index + 1}</td>
                        {/*<td>{index+1}</td>*/}
                        <td>{book.book_id}</td>
                        <td>{highlightText(book.author, searchQuery)}</td> 
                        <td><a href={`https://${book.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-4
                              hover:text-blue-500">
                              {highlightText(book.title, searchQuery)}</a></td> 
                        <td>{highlightText(book.topic, searchQuery)}</td> 
                        <td>{highlightText(book.category, searchQuery)}</td>
                        <td>{book.location}</td>
                        <td>
                          <BookAction
                            onReturn={() => handleReturnBook(book)} /> 
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
                    setCurrentPage(1);
                  }}
                  />
              </div>
          </div>
    )
}

export default BorrowBook