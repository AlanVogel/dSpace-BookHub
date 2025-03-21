import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from "../libs/consts";
import { getUserRole } from "../../utils/auth";

const linkClass =
	"flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base"

export default function Sidebar() {
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        getUserRole().then(setUserRole);
    }, []);

  return (
    <div className="flex flex-col w-60 p-3 bg-neutral-900 text-white">
        <div className="flex items-center gap-2 px-1 py-3">
            <img className="w-50 h-27 object-contain" src={"/img/logo3.jpg"} alt="logo"/>
            {/*<span className="text-neutral-100 text-lg"> dSPACE BookHub</span>*/}
        </div>
        <div className="flex flex-1 flex-col py-8 gap-0.5">
            {DASHBOARD_SIDEBAR_LINKS.map((item) => (
                <SidebarLink key={item.key} item={item} userRole={userRole} />
            ))}
        </div>
        <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
            {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
                <SidebarLink key={item.key} item={item} userRole={userRole} />
            ))}
            <div className={classNames(linkClass,"cursor-pointer text-red-500")}>
                <span className="text-xl">
                    <HiOutlineLogout />
                </span>
                <Link to={"/logout"}>Logout</Link>
            </div>
        </div>
    </div>
  )
}

function SidebarLink({item, userRole}) {
    const {pathname} = useLocation()
    const isEmployees = item.key === "customers";
    const isDisabled = isEmployees && userRole !== "admin";
    

    return isDisabled ? (
        <div className={classNames("cursor-not-allowed text-neutral-600", linkClass)}>
            <span className="text-xl">{item.icon}</span>
            {item.label}
        </div>
    ) : (
        <Link to={item.path} className={classNames(pathname === item.path ? "bg-neutral-700 text-white" : "text-neutral-400", linkClass)}>
            <span className="text-xl">{item.icon}</span>
            {item.label}
        </Link>
    );
}
