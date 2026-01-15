/**
 * @description User management page
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-12
 */
import { JSX, useEffect } from 'react';
import { GetUserResponse } from '../../types/users/GetUserResponse.ts';
import DynamicTable from '../../components/DynamicTable.tsx';
import { SearchField } from '../../types/common/SearchField.ts';

const users: GetUserResponse[] = [
	{
		id: '1',
		username: 'nguyenvana',
		role: 'admin',
		email: 'nguyenvana@example.com',
		phone: '0905123456',
		status: 'active',
		createdAt: '2025-01-10T08:15:00Z',
		updatedAt: '2025-11-01T14:22:00Z',
	},
	{
		id: '2',
		username: 'lethib',
		role: 'customer',
		email: 'lethib@example.com',
		phone: '0912345678',
		status: 'inactive',
		createdAt: '2024-09-20T09:40:00Z',
		updatedAt: '2025-03-02T10:12:00Z',
	},
	{
		id: '3',
		username: 'tranminhc',
		role: 'manager',
		email: 'tranminhc@example.com',
		phone: '0987654321',
		status: 'active',
		createdAt: '2025-05-18T12:00:00Z',
		updatedAt: '2025-11-10T16:45:00Z',
	},
	{
		id: '4',
		username: 'phamthid',
		role: 'customer',
		email: 'phamthid@example.com',
		phone: '0909876543',
		status: 'banned',
		createdAt: '2023-12-25T07:30:00Z',
		updatedAt: '2025-06-15T11:05:00Z',
	},
];

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: 'Tên người dùng',
		dataIndex: 'username',
		key: 'username',
	},
	{
		title: 'Vai trò',
		dataIndex: 'role',
		key: 'role',
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email',
	},
	{
		title: 'Số điện thoại',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
	},
	{
		title: 'Ngày tạo',
		dataIndex: 'createdAt',
		key: 'createdAt',
	},
	{
		title: 'Cập nhật lần cuối',
		dataIndex: 'updatedAt',
		key: 'updatedAt',
	},
];

const search: SearchField = {
	placeholder: 'Tìm kiếm khách hàng',
	allowClear: true,
	style: {
		width: 250,
	},
};

export default function UserManagement(): JSX.Element {
	useEffect((): void => {
		document.title = 'Quản lý người dùng';
	}, []);

	return (
		<DynamicTable<GetUserResponse>
			columns={columns}
			selectedText={'Số người dùng được chọn'}
			dataSource={users}
			timeout={1000}
			search={search}
		/>
	);
}
