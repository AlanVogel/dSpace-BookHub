import React, {useState} from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, login } from "../../utils/auth";

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const data = await login(email, password);

        if (data) {
            navigate("/home");
        } 
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError(String(err));
        }
    }
   };

    return isAuthenticated() ? (
        <Navigate to="/" />
    ) : (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-62 h-40 mr-2" src={"/img/logo3.jpg"} alt="logo"/>
                </h1>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800
                 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-grey-900 md:text-2xl dark:text-white">
                        Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={e => handleSubmit(e)}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@dspace.hr" required={true} 
                                 value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                                 focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                                 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="Enter your password" required={true} value={password} onChange={e => setPassword(e.target.value)}/>
                            </div>
                            {error && <p style={{color: "red"}}>{error}</p>}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none
                             focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700
                             dark:focus:ring-primary-800" onClick={handleSubmit}>Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                             Don't have an acoount yet?
                             <Link to={"/register"} className="font-medium text-primary-600 hover:underline dark:text-primary-500" ml-1> Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;