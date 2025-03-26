import React, { useState, useEffect } from "react";
import { updateAccount, returnCurrentUser } from "./Admin/User";
import { verifyPassword } from "../utils/auth";
import { logout } from "../utils/auth";

function Settings() {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  } 

  useEffect(() => {
    const fetchUser = async () => {
      const fetch_data = await returnCurrentUser();
      if (fetch_data && !Array.isArray(fetch_data)) {
        setUser(fetch_data);
      } else {
        console.error("Invalid data structure from API:", fetch_data);
        setUser(null);
      }
    };
      fetchUser();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !user.email) {
      setError("User data is not available.");
      return;
    }
    const isOldPasswordCorrect = await verifyPassword(user.email, oldPassword);

    if (!isPasswordValid(password)){
      setError("Password must be at least 6 charachters long, contain at\n"
        +"least one number and one uppercase letter.");
      return;
    } else if (!name.trim() && !password.trim()){
      setError("You must enter at least one field to update.");
      return;
    } else if(!isOldPasswordCorrect){
      setError("Old password is incorrect!");
      return;
    } else if(password !== confirmPassword){
      setError("Password doesn't match with confirm password!");
      return;
    } else {

      try {
        const data = await updateAccount(
          user.id, 
          name.trim() || undefined, 
          password.trim() || undefined,
          undefined
        );
        if (data && password.trim() !== oldPassword.trim()) {
          setTimeout(async () => {
            await logout();
            window.location.href = "/";
          }, 2000);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800
         dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-grey-900 md:text-2xl dark:text-white">
                Update your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={e => handleSubmit(e)}>
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input type="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                         focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                         dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your user name" 
                         required={true} value={name} onChange={e => setName(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="old password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old password</label>
                        <input type="password" name="old password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                         focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         placeholder="Old password" value={oldPassword} required={true} onChange={e => setOldPassword(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                         focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         placeholder="Enter your new password" value={password} required={true} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="confirm password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input type="password" name="confirm password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                         focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         placeholder="Confirm your new password" value={confirmPassword} required={true} onChange={e => setConfirmPassword(e.target.value)}/>
                    </div>
                    {error && <p style={{color: "red"}}>{error}</p>}
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none
                     focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700
                     dark:focus:ring-primary-800" onClick={handleSubmit}>Update</button>
                </form>
            </div>
        </div>
    </div>
</section>
  )
}

export default Settings;