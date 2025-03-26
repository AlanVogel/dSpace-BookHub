import {
	HiOutlineViewGrid,
	HiOutlineUsers,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi';
import { GiBookshelf } from "react-icons/gi";

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/home',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'books',
		label: 'MyBooks',
		path: '/home/books',
		icon: <GiBookshelf />
	},
	{
		key: 'customers',
		label: 'Employees',
		path: '/home/customers',
		icon: <HiOutlineUsers />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/home/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/home/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]
