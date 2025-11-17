/**
 * @description Dynamic table component
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-16
 */

import React, { JSX, useState } from 'react';
import { Button, Flex, GetProps, Input, Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ButtonField } from '../types/common/ButtonField.ts';
import { SearchField } from '../types/common/SearchField.ts';

/**
 * @description Get {Search} component from {Input} package
 */
const { Search } = Input;

/**
 * Get search function
 */
type SearchProps = GetProps<typeof Input.Search>;
const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
	console.log(info?.source, value);

/**
 * @description Type for row selection
 */
type TableRowSelection<T extends object = object> =
	TableProps<T>['rowSelection'];

/**
 * @description Props for dynamic table
 */
interface DynamicTableProps<T> {
	columns: ColumnsType<T>;
	dataSource: T[];
	buttons?: ButtonField[];
	selectedText?: string;
	timeout?: number;
	search?: SearchField;
}

/**
 * @description Dynamic table component
 * @param columns - Column type of table
 * @param dataSource  - Data to display to table
 * @param button - Button
 * @param timeout - Time to wait when call api
 */
export default function DynamicTable<T extends object>({
	columns,
	dataSource,
	buttons,
	selectedText,
	search,
	timeout = 1000,
}: DynamicTableProps<T>): JSX.Element {
	/**
	 * State for selected row key
	 */
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [loadingButton, setLoadingButton] = useState<string | null>(null);

	/**
	 * Function to start loading
	 */
	const handleButtonClick = (btn: ButtonField) => {
		if (btn.useTimeout) {
			setLoadingButton(btn.name);

			setTimeout((): void => {
				setLoadingButton(null);
			}, timeout);
		}

		btn.onClick?.();
	};

	/**
	 * Function to handle selected row change
	 * @param newSelectedRowKeys - New selected row keys
	 */
	const onSelectedChange = (newSelectedRowKeys: React.Key[]): void => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	/**
	 * Row selection config
	 */
	const rowSelection: TableRowSelection<T> = {
		selectedRowKeys,
		onChange: onSelectedChange,
	};

	/**
	 * Check whether the table has selected row
	 */
	const hasSelected: boolean = selectedRowKeys.length > 0;

	return (
		<Flex
			gap='middle'
			vertical
		>
			<Flex
				align='center'
				gap='middle'
			>
				{search ? (
					<Search
						placeholder={search.placeholder ?? 'Tìm kiếm'}
						allowClear={search.allowClear}
						onSearch={onSearch}
						style={search.style}
					/>
				) : null}

				{buttons?.map(
					(btn: ButtonField, index: number): JSX.Element => {
						return (
							<>
								<Button
									key={index}
									type='primary'
									onClick={(): void => handleButtonClick(btn)}
									disabled={
										btn.disable
											? btn.disable(selectedRowKeys)
											: false
									}
									loading={loadingButton === btn.name}
								>
									{btn.name}
								</Button>
							</>
						);
					}
				)}

				{hasSelected && selectedText
					? `${selectedText}: ${selectedRowKeys.length}`
					: null}
			</Flex>

			<Table<T>
				rowKey='id'
				rowSelection={rowSelection}
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 'max-content' }}
			/>
		</Flex>
	);
}
