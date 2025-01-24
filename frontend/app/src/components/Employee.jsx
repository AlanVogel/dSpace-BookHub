import React, { useEffect, useState} from "react";
import { returnUsers, deleteUser, editUser } from "./Admin/User";
import { UserAction } from "./libs/helpers";

function Employee() {
    const [user, setUsers] = useState([]);
    
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

    const handleEdit = (user) => {
        editUser(user);
    };
    
    const handleDelete = (user) => {
        deleteUser(user);
        window.location.reload();
    };
  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 overflow-visible">
            <strong className="text-gray-700 font-medium">All Employees</strong>
            <div className="mt-3 border-x rounded-sm border-gray-200">
                <table className="w-full text-gray-700">
                    <thead>
                        <tr className="font-bold">
                            <td>ID</td> 
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
                         user.map((user) => (
                            <tr key={user.id}>
                                <td>#{user.id}</td>
                                <td>{user.user_name}</td>
                                <td>{user.email}</td> 
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
            </div>
        </div>
  )
}

export default Employee