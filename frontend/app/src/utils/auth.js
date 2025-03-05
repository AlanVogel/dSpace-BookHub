import Cookie from "js-cookie";
import { toast } from "react-toastify";
import api from "./api";

export const isAuthenticated = () => {
    const permissions = Cookie.get("permission");
    if(!permissions) {
        return false;
    }
    return permissions === "user" || permissions === "admin" ? true : false;
};

export const login = async (email, password) => {
    if(!(email.length > 0) || !(password.length > 0)) {
        throw new Error("Email or password was not provided");
    }

    const formData = new FormData();
    //OAuth2 expects form data not JSON data
    formData.append("username", email);
    formData.append("password", password);

    try {
        const {data} = await api.post("/login", formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        toast.success("Logged in successfully!");
        return data;
    } catch (error) {
        if (error.response) {
            const errorMsg = error.response.data?.detail || "Login error";
            toast.error(errorMsg);
            console.error("Validation Error Response:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            toast.error("Request Error:", error.message);
            console.error("Request Error:", error.message);
        }
    }
};

export const signup = async (
    name,
    email,
    password,
    confirmPassword
) => {

    if(!(name.length > 0)) {
        throw new Error("Name was not provided");
    }
    if(!(email.length > 0)) {
        throw new Error("Email was not provided");
    }
    if(!(password.length > 0)) {
        throw new Error("Password was not provided");
    }
    if(!(confirmPassword.length > 0)) {
        throw new Error("Confirm password was not provided");
    }
    if(password !== confirmPassword){
        throw new Error("Password doesn't match");
    }

    const payload = {
        user_name: name,
        email: email,
        password: password,
        confirm_password: confirmPassword,
    };

    try {
        const {data} = await api.post("/signup", payload, {
            headers: {"Content-Type": "application/json"},
        });
        toast.success("Signed up successfully!");
        return data;
    } catch (error) {
        if (error.response) {
            const errorMsg = error.response.data?.detail || "Signup error";
            toast.error(errorMsg);
            console.error("Validation Error Response:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            toast.error("Request Error: " + error.message);
            console.error("Request Error:", error.message);
        }
    }

}

export const logout = async () => {
    try {
        const response = await api.post("/logout", {});
        //window.location.reload();
        toast.info(response.data.detail || "Logged out successfully!");
    } catch (error) {
        if (error.response) {
            const errorMsg = error.response.data?.detail || "Logout error";
            toast.error(errorMsg);
            console.error("Failed to log out:", error.response.data);
        } else {
            toast.error("Request Error: " + error.message);
            console.error("Failed to log out:", error.message);
        }
    }
};