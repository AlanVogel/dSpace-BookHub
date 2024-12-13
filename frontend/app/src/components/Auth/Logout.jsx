import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";


const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            await logout();
            navigate("/");
        };
        performLogout();
    }, [navigate]);

    return null;
};

export default Logout;





