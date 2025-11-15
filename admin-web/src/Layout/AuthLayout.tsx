/**
 * @description Auth layout
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-12
 */

import { JSX } from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout(): JSX.Element {
	return (
		<div
			className={'min-h-screen bg-white flex justify-center items-center'}
		>
			<div className='border border-gray-200 px-4 pt-4 shadow-lg rounded-lg bg-white'>
				<Outlet />
			</div>
		</div>
	);
}
