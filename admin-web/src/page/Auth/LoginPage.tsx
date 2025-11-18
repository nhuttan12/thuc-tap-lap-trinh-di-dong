/**
 * @description Login page
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-12
 */

import { JSX, useEffect } from 'react';
import DynamicForm from '../../components/DynamicForm';
import { FormField } from '../../types/common/FormField';

export default function LoginPage(): JSX.Element {
	useEffect((): void => {
		document.title = 'Đăng nhập';
	}, []);

	const fields: FormField[] = [
		{
			label: 'Tài khoản',
			name: 'username',
			type: 'text',
			required: true,
		},
		{
			label: 'Mật khẩu',
			name: 'password',
			type: 'password',
			required: true,
		},
	];

	const handleLogin = (values: string) => {
		console.log(values);
	};

	// const onFinishFailed = (errorInfo: string) => {
	// 	console.log('Failed:', errorInfo);
	// };

	return (
		<DynamicForm
			fields={fields}
			onFinish={handleLogin}
			submitText='Đăng nhập'
			formWidth={'600px'}
		/>
	);
}
