/**
 * @description Dynamic modal component
 * @author @nhuttan12
 * @since 2025-11-14
 * @version 1.0.0
 */

import { Button, Input, Modal, Typography } from 'antd';
import { JSX, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';

/**
 * @description Button field interface
 * @property {string} name - Button name
 * @property {'submit' | 'reset' | 'button'} type - Button type
 * @property {function} onClick - Button click handler
 */
interface ButtonField {
	name: string;
	type?: 'submit' | 'reset' | 'button';
	onClick?: () => void;
}

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
	confirm: boolean;
	message?: string;
	timeout?: number;
	description?: string;
	fields?: FormField[];
	buttons: ButtonField[];
}

export default function DynamicModal({
	confirm,
	buttons,
	message,
	description,
	fields,
	timeout = 2000,
}: DynamicModalProps): JSX.Element {
	/**
	 * @description Modal state
	 */
	const [open, setOpen] = useState<boolean>(false);
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

		/**
		 * Checking confirm statement whether true or false
		 */
		if (confirm) {
			/**
			 * Call {showConfirm} function to show confirm-modal
			 */
			showConfirm?.();
		} else {
			/**
			 * Call {showLoading} function to show custom-modal with loading status
			 */
			showLoading?.();
		}
	};

	/**
	 * @description Initialize show loading and show confirm function
	 */
	let showLoading: (() => void) | undefined;
	let showConfirm: (() => void) | undefined;

	/**
	 * Checking confirm statement whether true or false
	 */
	if (!confirm) {
		showLoading = (): void => {
			setOpen(true);
			setLoading(true);

			setTimeout((): void => {
				setLoading(false);
			}, timeout);
		};
	} else if (confirm) {
		/**
		 * @description Show confirm modal
		 */
		showConfirm = (): void => {
			Modal.confirm({
				title: message,
				icon: <ExclamationCircleFilled />,
				content: description,
				onOk(): void {
					/**
					 * If user clicked ok button, call stored function stored in pending action state
					 */
					if (pendingAction) {
						pendingAction();
					}
				},
				onCancel(): void {
					console.log('Cancel');
				},
			});
		};
	}

	return (
		<>
			{/*If not confirm modal*/}
			{!confirm ? (
				<>
					{buttons.map(
						(button: ButtonField, index: number): JSX.Element => {
							return (
								<Button
									key={index}
									type={'primary'}
									htmlType={button.type}
									onClick={(): void =>
										handleButtonClick(button)
									}
								>
									{button.name}
								</Button>
							);
						}
					)}

					<Modal
						title={<p>Loading modal</p>}
						footer={buttons.map(
							(
								button: ButtonField,
								index: number
							): JSX.Element => {
								return (
									<Button
										key={index}
										type={'primary'}
										htmlType={button.type}
										onClick={button.onClick}
									>
										{button.name}
									</Button>
								);
							}
						)}
						loading={loading}
						open={open}
						onCancel={(): void => setOpen(false)}
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
					{buttons.map(
						(button: ButtonField, index: number): JSX.Element => {
							return (
								<Button
									key={index}
									htmlType={button.type}
									type={'primary'}
									onClick={(): void =>
										handleButtonClick(button)
									}
								>
									{button.name}
								</Button>
							);
						}
					)}
				</>
			)}
		</>
	);
}
