/**
 * @description Dynamic modal component
 * @author @nhuttan12
 * @since 2025-11-14
 * @version 1.0.0
 */

import { Button, Input, Modal, Typography } from 'antd';
import { JSX, useState } from 'react';
import { ButtonField } from '../types/common/ButtonField.ts';

interface FormField {
	value: string;
	label: string;
	disable: boolean;
	maximumLength?: number;
	type?: 'text' | 'password' | 'email';
	required?: boolean;
	message?: string;
}

/**
 * @description Dynamic modal
 * @property {boolean} confirm - Determining whether the modal is confirmed modal or not
 * @property {ButtonField[]} buttons - Array of button fields
 */
interface DynamicModalProps {
	open: boolean;
	onClose: () => void;
	confirm: boolean;
	title: string;
	content?: string;
	fields?: FormField[];
	buttons: ButtonField[];
}

export default function DynamicModal({
	open,
	onClose,
	confirm,
	buttons,
	title,
	content,
	fields,
}: DynamicModalProps): JSX.Element {
	/**
	 * @description Modal state
	 */
	const [loading, setLoading] = useState<boolean>(false);
	const [pendingAction, setPendingAction] = useState<(() => void) | null>(
		null
	);

	/**
	 * @description Handle button click
	 * @param button - Button field
	 */
	const handleButtonClick: (button: ButtonField) => void = (
		button: ButtonField
	): void => {
		/**
		 * Store call-back function of button clicked to pending action state
		 */
		setPendingAction((): (() => void) | null => button.onClick ?? null);
	};

	/**
	 * @description Initialize show loading and show confirm function
	 */

	/**
	 * Checking confirm statement whether true or false
	 */
	const showLoading: (() => void) | undefined = async (): Promise<void> => {
		setLoading(true);

		if (pendingAction) {
			await pendingAction();
			setPendingAction(null);
		}
	};

	return (
		<>
			{/*If not confirm modal*/}
			{!confirm ? (
				<>
					<Modal
						title={<p>{title}</p>}
						footer={buttons.map(
							(
								button: ButtonField,
								index: number
							): JSX.Element => {
								return (
									<Button
										key={index}
										type={button.type}
										htmlType={button.htmlType}
										onClick={(): void => {
											handleButtonClick(button);
											showLoading();
										}}
									>
										{button.name}
									</Button>
								);
							}
						)}
						loading={loading}
						open={open}
						onCancel={onClose}
					>
						<div>
							{fields?.map(
								(
									field: FormField,
									index: number
								): JSX.Element => {
									return (
										<>
											<Typography.Title
												level={5}
												key={index}
											>
												{field.label}
											</Typography.Title>
											<Input
												count={{
													show: true,
													max:
														field.maximumLength ??
														10,
												}}
												disabled={field.disable}
												defaultValue={field.value}
												key={index}
											/>
										</>
									);
								}
							)}
						</div>
					</Modal>
				</>
			) : (
				// If confirm modal
				<>
					<Modal
						title={<p>{title}</p>}
						footer={buttons.map(
							(
								button: ButtonField,
								index: number
							): JSX.Element => {
								return (
									<Button
										key={index}
										type={button.type}
										htmlType={button.htmlType}
										onClick={button.onClick}
									>
										{button.name}
									</Button>
								);
							}
						)}
						loading={loading}
						open={open}
						onCancel={onClose}
					>
						<div>{content}</div>
					</Modal>
				</>
			)}
		</>
	);
}
