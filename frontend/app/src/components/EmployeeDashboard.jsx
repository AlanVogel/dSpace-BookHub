import React, { useState, useCallback } from "react";
import Employee from "./Employee";
import { EmployeeModal } from "./libs/helpers/Modal";
import DashboardUserGrid from "./DashboardUserGrid";

export default function EmployeeDashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [childUserData, setChildUserData] = useState([]);
    
    const handleDataEmployeeTable = useCallback((totalUsers, totalAdminUsers) => {
      setChildUserData([totalUsers, totalAdminUsers]);
    }, []);
  
    // Handle opening the modal for editing
    const handleEditUser = (user) => {
      setEditUser(user); // Set the book to be edited
      setModalOpen(true); // Open the modal
    };
  
    return (
      <div className="flex flex-col gap-4">
          <DashboardUserGrid userData={childUserData}/>
          <div className="flex flex-row gap-4 w-full">
            <Employee onEdit={handleEditUser} getData={handleDataEmployeeTable}/>
          </div>
          <div className="flex gap-4 justify-center">
            {/*<button type="submit" className=" text-white bg-primary-600
             hover:bg-primary-700 focus:outline-none focus:ring-primary-300 
             font-medium rounded-lg text-sm py-2.5 w-24
             dark:bg-primary-600 dark:hover:bg-primary-700
             dark:focus:ring-primary-800" onClick={handleAddBook}>
                Add Book
            </button>*/}
            {modalOpen && (
              <EmployeeModal closeModal={() => {
                setModalOpen(false);
                }}
                userData={editUser} 
              /> 
            )}
          </div>
      </div>
    )
  }