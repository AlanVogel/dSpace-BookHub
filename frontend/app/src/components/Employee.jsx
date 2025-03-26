import React, { useContext, useEffect, useState} from "react";
import { returnUsers, deleteUser} from "./Admin/User";
import { UserAction, Pagination, SearchContext, highlightText } from "./libs/helpers";

function Employee( {onEdit, getData} ) {
    const [user, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {searchQuery} = useContext(SearchContext);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await returnUsers();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("Invalid data structure from API:", data);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (user.length > 0) {
            const validUser = Array.isArray(user) ? user : [0];
            const totalUsers = validUser.length || 0;
            const totalAdmins = validUser.filter(u => u.is_superuser).length || 0;
            getData([totalUsers, totalAdmins]);
        }
    }, [user, getData]);

    const filteredUsers = user.filter((user) =>
        user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEdit = (user) => {
        onEdit(user);
    };
    
    const handleDelete = (user) => {
        deleteUser(user);
        window.location.reload();
    };
  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 overflow-visible">
            <strong className="text-gray-700 font-medium">All Employees</strong>
            <div className="mt-3 border-x rounded-sm border-gray-200">
                <table className="w-full text-center text-gray-700">
                    <thead>
                        <tr className="font-bold">
                            <td>#</td>
                            {/*<td>ID</td>*/} 
                            <td>Name</td> 
                            <td>Email</td> 
                            <td>Password</td> 
                            <td>Active</td>
                            <td>Admin</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(user) && 
                         paginatedUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                {/*<td>{index+1}</td>*/}
                                {/*<td>{user.id}</td>*/}
                                <td>{highlightText(user.user_name, searchQuery)}</td>
                                <td>{highlightText(user.email, searchQuery)}</td> 
                                <td>{user.hashed_password}</td>
                                <td>{user.is_active.toString()}</td>
                                <td>{user.is_superuser.toString()}</td>
                                <td>
                                    <UserAction  
                                    onEdit={() => handleEdit(user)}  
                                    onDelete={() => handleDelete(user)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredUsers.length}
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

export default Employee