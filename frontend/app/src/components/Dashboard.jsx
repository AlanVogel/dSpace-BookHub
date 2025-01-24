import React, { useState } from "react";
import DashboardBooksGrid from "./DashboardBooksGrid";
import BookTable from "./BookTable";
import { Modal } from "./libs/helpers/Modal";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);

  // Handle opening the modal for editing
  const handleEditBook = (book) => {
    setEditBook(book); // Set the book to be edited
    setModalOpen(true); // Open the modal
  };
  
  // Handle opening the modal for adding
  const handleAddBook = () => {
    setEditBook(null); // Clear any book data (Add mode)
    setModalOpen(true); // Open the modal
  };

  return (
    <div className="flex flex-col gap-4">
        <DashboardBooksGrid/>
        <div className="flex flex-row gap-4 w-full">
          <BookTable onEdit={handleEditBook} />
        </div>
        <div className="flex gap-4 justify-center">
          <button type="submit" className=" text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-primary-300 
           font-medium rounded-lg text-sm py-2.5 w-24
           dark:bg-primary-600 dark:hover:bg-primary-700
           dark:focus:ring-primary-800" onClick={handleAddBook}>
              Add Book
          </button>
          {modalOpen && (
            <Modal closeModal={() => {
              setModalOpen(false);
              }}
              isEditMode={!!editBook}
              bookData={editBook} 
              /*onSubmit={(author, title, topic, category, link) => {
                if (editBook) {
                  editBook(editBook.id, author, title, topic, category, link);
                }
              setModalOpen(false);
              }}*/
            /> 
          )}
        </div>
    </div>
  )
}

