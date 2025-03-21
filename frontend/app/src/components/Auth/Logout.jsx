import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";


const Logout = () => {
    const navigate = useNavigate();
    const hasLoggedOut = useRef(false);

    useEffect(() => {
        const performLogout = async () => {
            if (hasLoggedOut.current) return;
            hasLoggedOut.current = true;
            await logout();
            navigate("/");
        };
        performLogout();
    }, [navigate]);

    return null;
};

export default Logout;





