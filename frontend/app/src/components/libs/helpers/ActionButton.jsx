import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiMiniPencil, HiOutlineTrash } from "react-icons/hi2";
import { MdAddShoppingCart } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";

export function Action({ onBorrow, onEdit, onDelete }) {
    return (
        <div className="relative inline-block text-right">
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm font-semibold text-white shadow focus:outline-none hover:bg-gray-700">
                    Options
                    <FaChevronDown className="size-4 fill-white/60" />
                </MenuButton>
                <MenuItems
                    className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-lg bg-white p-1 shadow-lg focus:outline-none"
                >
                    <MenuItem
                        as="button"
                        onClick={onBorrow}
                        className={({ active }) =>
                            `${active ? "bg-gray-100" : ""} group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm`
                        }
                    >
                        <MdAddShoppingCart className="size-4 text-gray-500" />
                        Borrow
                    </MenuItem>
                    <div className="my-1 h-px bg-gray-200" />
                    <MenuItem
                        as="button"
                        onClick={onEdit}
                        className={({ active }) =>
                            `${active ? "bg-gray-100" : ""} group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm`
                        }
                    >
                        <HiMiniPencil className="size-4 text-gray-500" />
                        Edit
                    </MenuItem>
                    <MenuItem
                        as="button"
                        onClick={onDelete}
                        className={({ active }) =>
                            `${active ? "bg-gray-100" : ""} group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm`
                        }
                    >
                        <HiOutlineTrash className="size-4 text-gray-500" />
                        Delete
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    );
}

export function UserAction({ onEdit, onDelete }) {
    return (
        <div className="relative inline-block text-right">
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm font-semibold text-white shadow focus:outline-none hover:bg-gray-700">
                    Options
                    <FaChevronDown className="size-4 fill-white/60" />
                </MenuButton>
                <MenuItems
                    className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-lg bg-white p-1 shadow-lg focus:outline-none"
                >
                    <MenuItem
                        as="button"
                        onClick={onEdit}
                        className={({ active }) =>
                            `${active ? "bg-gray-100" : ""} group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm`
                        }
                    >
                        <HiMiniPencil className="size-4 text-gray-500" />
                        Edit
                    </MenuItem>
                    <MenuItem
                        as="button"
                        onClick={onDelete}
                        className={({ active }) =>
                            `${active ? "bg-gray-100" : ""} group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm`
                        }
                    >
                        <HiOutlineTrash className="size-4 text-gray-500" />
                        Delete
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    );
}
