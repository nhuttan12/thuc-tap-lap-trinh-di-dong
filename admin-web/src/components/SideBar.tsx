/**
 * @description Side bar component
 * @author @nhuttan12
 * @version 1.0.1
 * @since 2025-11-16
 */

import { JSX } from 'react';
import { Menu, MenuProps } from 'antd';
import {
	DropboxOutlined,
	ExceptionOutlined,
	LogoutOutlined,
	ProfileOutlined,
	SettingOutlined,
	UserOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * @description Side bar props
 * @property {string} activeKey - Active key
 * @property {function} onSelect - Select handler
 */
interface SidebarProps {
	activeKey: string;
	onSelect: (key: string) => void;
}

const items: MenuItem[] = [
	{
		label: 'Khách hàng',
		key: 'customer',
		icon: <UserOutlined />,
	},
	{
		label: 'Sản phẩm',
		key: 'products',
		icon: <DropboxOutlined />,
	},
	{
		label: 'Hoá đơn',
		key: 'orders',
		icon: <ExceptionOutlined />,
	},
	{
		label: 'Tuỳ chọn',
		key: 'settings',
		icon: <SettingOutlined />,
		children: [
			{
				label: 'Hồ sơ',
				key: 'profile',
				icon: <ProfileOutlined />,
			},
			{
				label: 'Đăng xuất',
				key: 'logout',
				icon: <LogoutOutlined />,
			},
		],
	},
];

const logo: string = '/vite.svg';

export default function SideBar({
	onSelect,
	activeKey,
}: SidebarProps): JSX.Element {
	return (
		<div className={'min-h-screen w-full'}>
			<div className='p-4 text-white text-xl font-bold'>
				<img
					src={logo}
					alt=''
				/>
			</div>
			<Menu
				theme='dark'
				mode='inline'
				items={items}
				selectedKeys={[activeKey]}
				onClick={(e) => onSelect(e.key)}
			/>
		</div>
	);
}
