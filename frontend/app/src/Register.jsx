import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@dspace\.hr$/;
        return emailRegex.test(email)
    }

    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    } 

    const registerUser = async (e) => {
        e.preventDefault()
        if (!isEmailValid(email)) {
            setError("Email must be in the 'dspace.hr' domain.")
            return;
        }
        if (password !== confirmPassword){
            setError("Password do not match!")
            return;
        }
        if (!isPasswordValid(password)){
            setError("Password must be at least 6 charachters long, contain at\n"
                +"least one number and one uppercase letter.");
            return;
        }
        await axios.post("/signup", {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }).then(res => {
            // use js-cookie to fecth the data from backend 
            document.cookie = `token=${res.data.token}`
            document.cookie = `userID=${res.data.userID}`
            navigate("/")
            setError("")
        }).catch(err => {
            alert(`Register error`)
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            console.log(err)
        })
    }

    return(
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-62 h-40 mr-2" src={"/img/logo3.jpg"} alt="logo"/>
                </h1>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800
                 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-grey-900 md:text-2xl dark:text-white">
                        Register your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={e => registerUser(e)}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                                <input type="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your user name" 
                                 required={true} onChange={e => setName(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your Email" 
                                 required={true} value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                                 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                 placeholder="Enter your password" required={true} onChange={e => setPassword(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="confirm password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input type="confirm password" name="confirm password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                                 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                 placeholder="Confirm your password" required={true} onChange={e => setConfirmPassword(e.target.value)}/>
                            </div>
                            {error && <p style={{color: "red"}}>{error}</p>}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none
                             focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700
                             dark:focus:ring-primary-800">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
    
}

export default Register;