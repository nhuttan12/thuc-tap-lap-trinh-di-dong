/**
 * @description Product management page
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-12
 */

import { JSX, useEffect, useState } from 'react';
import { GetAllProductResponse } from '../../types/products/GetAllProductResponse.ts';
import { ColumnsType } from 'antd/es/table';
import DynamicTable from '../../components/DynamicTable.tsx';
import { ButtonField } from '../../types/common/ButtonField.ts';
import { SearchField } from '../../types/common/SearchField.ts';
import DynamicModal from '../../components/DynamicModal.tsx';
import { DeleteOutlined } from '@ant-design/icons';

const products: GetAllProductResponse[] = [
	{
		id: 1,
		image: 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png',
		name: 'Nike Air Force 1 ’07',
		price: 2990000,
		discount: 10,
		color: 'Trắng',
		rating: 4.8,
		size: ['38', '39', '40', '41', '42', '43'],
		description:
			'Đôi giày biểu tượng Nike Air Force 1 ’07 với chất liệu da cao cấp, thiết kế tối giản và đế Air êm ái, phù hợp cho cả thời trang và thể thao.',
	},
	{
		id: 2,
		image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/347/092/products/gx5915-s1.jpg',
		name: 'Adidas Ultraboost 22',
		price: 3990000,
		discount: 15,
		color: 'Đen',
		rating: 4.7,
		size: ['37', '38', '39', '40', '41', '42', '43'],
		description:
			'Giày chạy bộ Adidas Ultraboost 22 mang lại độ đàn hồi cao và thoải mái nhờ công nghệ đệm Boost, kết hợp phần thân Primeknit ôm chân.',
	},
	{
		id: 3,
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLNuX_EkTXWtQ5DWsW3lOExTJDcz8s-RUQ1Q&s',
		name: 'Converse Chuck 70 High Top',
		price: 2200000,
		discount: 5,
		color: 'Trắng ngà',
		rating: 4.6,
		size: ['36', '37', '38', '39', '40', '41', '42'],
		description:
			'Thiết kế cổ điển từ thập niên 70, Converse Chuck 70 High Top mang phong cách retro với chất liệu canvas bền bỉ và đế cao su chắc chắn.',
	},
	{
		id: 4,
		image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/401263/02/sv01/fnd/VNM/fmt/png/Gi%C3%A0y-th%E1%BB%83-thao-RS-X-Efekt-BB',
		name: 'Puma RS-X Efekt',
		price: 2890000,
		discount: 20,
		color: 'Xám phối đỏ',
		rating: 4.5,
		size: ['38', '39', '40', '41', '42', '43', '44'],
		description:
			'Giày thể thao Puma RS-X Efekt có thiết kế hiện đại, phong cách chunky, đế RS đệm êm ái và phối màu năng động.',
	},
	{
		id: 5,
		image: 'https://product.hstatic.net/1000284478/product/0cm_bbw550bh_1_d772673315714817a468508747cb89cc.jpg',
		name: 'New Balance 550',
		price: 3590000,
		discount: 12,
		color: 'Trắng xanh navy',
		rating: 4.9,
		size: ['37', '38', '39', '40', '41', '42', '43'],
		description:
			'Mẫu giày New Balance 550 mang phong cách vintage, phối màu nhã nhặn, dễ phối đồ và cực kỳ thoải mái cho việc di chuyển hàng ngày.',
	},
];

const search: SearchField = {
	placeholder: 'Tìm kiếm sản phẩm',
	allowClear: true,
	style: {
		width: 200,
	},
};

export default function ProductManagement(): JSX.Element {
	const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

	useEffect((): void => {
		document.title = 'Quản lý người dùng';
	}, []);

	const buttons: ButtonField[] = [
		{
			name: 'Thêm sản phẩm',
			key: 'add product',
			type: 'primary',
			htmlType: 'button',
			onClick: (): void => setOpenCreateModal(true),
		},
		{
			name: 'Xóa sản phẩm',
			key: 'delete product',
			type: 'primary',
			htmlType: 'button',
			onClick: (): void => {
				setOpenDeleteModal(true);
			},
			disable: (selectedRowKeys: React.Key[]): boolean => {
				return selectedRowKeys.length === 0;
			},
		},
	];

	const columns: ColumnsType<GetAllProductResponse> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			width: 150,
		},
		{
			title: 'Hình ảnh',
			dataIndex: 'image',
			key: 'image',
			render: (image: string): JSX.Element => {
				return (
					<img
						src={image}
						style={{
							width: 60,
							height: 60,
							objectFit: 'cover',
							borderRadius: 8,
							border: '1px solid #eee',
						}}
					/>
				);
			},
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			render: (price: number): string => {
				return price.toLocaleString('vi-VN', {
					style: 'currency',
					currency: 'VND',
				});
			},
		},
		{
			title: 'Giảm giá (%)',
			dataIndex: 'discount',
			key: 'discount',
		},
		{
			title: 'Màu sắc',
			dataIndex: 'color',
			key: 'color',
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
		},
		{
			title: 'Kích cỡ',
			dataIndex: 'size',
			key: 'size',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: 300,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (): JSX.Element => {
				return (
					<DeleteOutlined
						onClick={(): void => {
							setOpenDeleteModal(true);
						}}
						style={{ color: 'red', cursor: 'pointer' }}
					/>
				);
			},
		},
	];

	return (
		<>
			<DynamicTable<GetAllProductResponse>
				buttons={buttons}
				columns={columns}
				dataSource={products}
				selectedText={'Số sản phẩm được chọn'}
				timeout={1000}
				search={search}
			/>

			<DynamicModal
				open={openCreateModal}
				onClose={(): void => setOpenCreateModal(false)}
				title='Thêm sản phẩm'
				confirm={false}
				buttons={[
					{
						name: 'Huỷ',
						key: 'cancel',
						htmlType: 'button',
						type: 'default',
						onClick: () => setOpenDeleteModal(false),
					},
					{
						name: 'Thêm sản phẩm',
						key: 'add product',
						htmlType: 'button',
						type: 'primary',
						onClick: () => console.log('Submit create form'),
					},
				]}
				fields={[
					{
						label: 'Tên sản phẩm',
						value: '',
						disable: false,
						required: true,
					},
					{ label: 'Giá', value: '', disable: false, type: 'text' },
				]}
			/>

			<DynamicModal
				buttons={[
					{
						name: 'Huỷ',
						key: 'cancel',
						htmlType: 'button',
						type: 'default',
						onClick: () => setOpenDeleteModal(false),
					},
					{
						name: 'Xoá sản phẩm',
						key: 'delete product',
						htmlType: 'button',
						type: 'primary',
						onClick: () => setOpenDeleteModal(false),
					},
				]}
				confirm={true}
				onClose={(): void => setOpenDeleteModal(false)}
				open={openDeleteModal}
				title={'Bạn có muốn xoá sản phẩm nầy không'}
			/>
		</>
	);
}
