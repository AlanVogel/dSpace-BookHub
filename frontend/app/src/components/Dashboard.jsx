import React, { useState, useCallback, useEffect } from "react";
import DashboardBooksGrid from "./DashboardBooksGrid";
import BookTable from "./BookTable";
import { Modal, StatusBookModal } from "./libs/helpers/Modal";
import { getUserRole } from "../utils/auth";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [borrowBook, setBorrowBook] = useState(null);
  const [childBookData, setChildBookData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const isDisabled = userRole !== "admin";
  
  useEffect(() => {
    getUserRole().then(setUserRole);
  }, []);

  const handleDataFromBookTable = useCallback((totalBooks, totalBorrowedBooks) => {
    setChildBookData([totalBooks, totalBorrowedBooks]);
  }, []);

  // Handle opening the modal for editing
  const handleEditBook = (book) => {
    setEditBook(book); // Set the book to be edited
    setBorrowBook(null); // Clear borrow state
    setModalOpen(true); // Open the modal
  };
  
  // Handle opening the modal for adding
  const handleAddBook = () => {
    setEditBook(null); // Clear any book data (Add mode)
    setBorrowBook(null); // Clear borrow state
    setModalOpen(true); // Open the modal
  };

  const handleBorrowBook = (book) => {
    setEditBook(null);
    setBorrowBook(book);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardBooksGrid booksData={childBookData}/>
      <div className="flex flex-row gap-4 w-full">
        <BookTable onEdit={handleEditBook} onBorrow={handleBorrowBook} getData={handleDataFromBookTable}/>
      </div>
      <div className="flex gap-4 justify-center">
        <button type="submit" className={`text-white font-medium rounded-lg text-sm py-2.5 w-24 transition 
            ${isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"}
          `} 
           onClick={handleAddBook}
           disabled={isDisabled}>
            Add Book
        </button>
        {modalOpen && (
            borrowBook ? (
              <StatusBookModal
                closeModal={() => 
                setModalOpen(false)}
                isBorrowMode={true}
                bookData={borrowBook}
              />
            ) : (
              <Modal closeModal={() => 
                setModalOpen(false)}
                isEditMode={!!editBook}
                bookData={editBook}
              />
            )
          )}
      </div>
    </div>
  )
}

