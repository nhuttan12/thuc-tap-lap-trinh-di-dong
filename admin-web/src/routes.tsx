import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './Layout/AuthLayout.tsx';
import LoginPage from './page/Auth/LoginPage.tsx';
import { JSX } from 'react';
import AdminLayout from './Layout/AdminLayout.tsx';

export default function AppRoutes(): JSX.Element {
	return (
		<Routes>
			{/*Public route*/}
			<Route
				path='/'
				element={
					<Navigate
						to={'/login'}
						replace
					/>
				}
			/>

			{/*Auth route*/}
			<Route element={<AuthLayout />}>
				<Route
					path='/login'
					element={<LoginPage />}
				/>
			</Route>

			<Route
				path='/admin'
				element={<AdminLayout />}
			></Route>
		</Routes>
	);
}
