/**
 * @description Admin layout
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-12
 */

import { JSX, useState } from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import SideBar from '../components/SideBar.tsx';
import UserManagement from '../page/Admin/UserManagement.tsx';
import ProductManagement from '../page/Admin/ProductManagement.tsx';
import OrdersManagement from '../page/Admin/OrdersManagement.tsx';

export default function AdminLayout(): JSX.Element {
	const [active, setActive] = useState<string>('customer');

	const renderContent = (): JSX.Element | null => {
		switch (active) {
			case 'customer':
				return <UserManagement />;
			case 'products':
				return <ProductManagement />;
			case 'orders':
				return <OrdersManagement />;
			case 'profiles':
				return <h1 className='text-2xl font-semibold'>Hồ sơ người dùng</h1>;
			case 'logout':
				return <h1 className='text-2xl font-semibold'>Đăng xuất</h1>;
			default:
				return null;
		}
	};

	return (
		<Layout className='min-h-screen'>
			<Sider
				breakpoint='lg'
				collapsedWidth='0'
			>
				<SideBar
					activeKey={active}
					onSelect={setActive}
				/>
			</Sider>
			<Content className='p-6'>{renderContent()}</Content>
		</Layout>
	);
}
