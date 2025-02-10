import React, { useState } from "react";
import BorrowBook from "./BorrowBook";
import { StatusBookModal } from "./libs/helpers/Modal";

export default function BorrowBookDashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [returnBook, setReturnBook] = useState(null);
  
    // Handle opening the modal for editing
    const handleReturnBook = (book) => {
      setReturnBook(book); // Set the status book to be edited
      setModalOpen(true); // Open the modal
    };
  
    return (
      <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 w-full">
            <BorrowBook onReturn={handleReturnBook} />
          </div>
          <div className="flex gap-4 justify-center">
            {modalOpen && (
              <StatusBookModal closeModal={() => {
                setModalOpen(false);
                }}
                isBorrowMode={false}
                bookData={returnBook} 
              /> 
            )}
          </div>
      </div>
    )
  }