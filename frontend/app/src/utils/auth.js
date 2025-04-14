import Cookie from "js-cookie";
import { toast } from "react-toastify";
import api from "./api";

export const getUserRole = async () => {
    try {
        const response = await api.get("/user_info", {
            headers: {
            "Content-Type": "application/json",
            }
        });
        return response.data.permission || "";
    } catch (error) {
        console.error("Failed to get user role:", error);
        return "";
    }
};

export const verifyPassword = async (email, old_password) => {
    const payload = {
        email: email,
        password: old_password
    };
    try {
        const response = await api.post("/verify_password", payload, {
            headers: {
            "Content-Type": "application/json",
            }
        });
        return response.data || "";
    } catch (error) {
        console.error("Failed to verify password: ", error);
        return null;
    }
};

export const isTokenActive = async () => {
    try {
        const response = await api.get("/user_info", {
            headers: {
                "Content-Type": "application/json",
            }
        });
        if(response.data.email) {
            return true;
        }
        return false;
    } catch(error) {
        console.error("Failed to check if token is active: ", error);
        return "";
    }
};

export const isAuthenticated = () => {
    const permissions = Cookie.get("access_token");
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
        toast.error(error.response.data?.detail, { autoClose: 3000 });
        throw new Error(error.response?.data?.detail || "Login failed");
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
        toast.error(error.response.data?.detail, { autoClose: 3000 });
        throw new Error(error.response?.data?.detail || "Signin failed");
    }

}

export const logout = async () => {
    try {
        const response = await api.post("/logout", {});
        toast.info(response.data.info.data.details);
    } catch (error) {
        toast.error(error.response.data?.detail, { autoClose: 3000 });
    }
};