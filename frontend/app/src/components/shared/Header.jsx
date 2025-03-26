import React, { Fragment, useContext } from "react";
import { Menu, Transition, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineSearch } from "react-icons/hi";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { SearchContext } from "../libs/helpers";

export default function Header() {
	const navigate = useNavigate()
	const {searchQuery, setSearchQuery} = useContext(SearchContext);

	return (
		<div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-between">
			<div className="relative">
				<HiOutlineSearch fontSize={20} className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
				<input
					type="text"
					placeholder="Search..."
					className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[24rem] h-10 pl-11 pr-4 rounded-sm"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			<div className="flex items-center gap-2 mr-2">
				<Menu as="div" className="relative">
					<div>
						<MenuButton className="flex gap-2 text-white bg-primary-600 hover:bg-primary-700 focus:outline-none
                             focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >
							<BsMenuButtonWideFill fontSize={20} />
							Menu
						</MenuButton>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
							<MenuItem>
								{({ active }) => (
									<div
										onClick={() => navigate('/home/settings')}
										className={classNames(
											active && 'bg-gray-100',
											'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
										)}
									>
										Settings
									</div>
								)}
							</MenuItem>
							<MenuItem>
								{({ active }) => (
									<div
										onClick={() => navigate("/logout")}
										className={classNames(
											active && 'bg-gray-100',
											'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
										)}
									>
										Logout
									</div>
								)}
							</MenuItem>
						</MenuItems>
					</Transition>
				</Menu>
			</div>
		</div>
	)
}
