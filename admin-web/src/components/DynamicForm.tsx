/**
 * @description Dynamic form component
 * @author @nhuttan12
 * @since 2025-11-14
 * @version 1.0.0
 */

import { Button, Form, Input } from 'antd';
import { JSX } from 'react';

/**
 * @description Form field interface
 * @property {string} name - Field name
 * @property {string} label - Field label
 * @property {'text' | 'password' | 'email'} type - Field type
 * @property {boolean} required - Field required
 * @property {string} message - Field message
 */
export interface FormField {
	name: string;
	label: string;
	type?: 'text' | 'password' | 'email';
	required?: boolean;
	message?: string;
}

/**
 * @description Dynamic form props
 * @property {FormField[]} fields - Array of form fields
 * @property {string} submitText - Submit button text
 * @property {string} formWidth - Form width
 * @property {string} formHeight - Form height
 * @property {function} onFinish - Form submit handler
 */
interface DynamicFormProps {
	fields: FormField[];
	submitText: string;
	formWidth: string;
	formHeight?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onFinish: (values: any) => void;
}

export default function DynamicForm({
	fields,
	formHeight,
	formWidth,
	onFinish,
	submitText = 'submit',
}: DynamicFormProps): JSX.Element {
	return (
		<Form
			name={'basic'}
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: formWidth, maxHeight: formHeight }}
			size={'large'}
			onFinish={onFinish}
			autoComplete='off'
		>
			{fields.map((field: FormField): JSX.Element => {
				return (
					<Form.Item
						key={field.name}
						label={
							<span style={{ fontSize: '18px', fontWeight: 500 }}>
								{field.label}
							</span>
						}
						name={field.name}
						rules={[
							{
								required: field.required,
								message: field.message,
							},
						]}
					>
						<Input />
					</Form.Item>
				);
			})}
			<Form.Item>
				<Button
					type={'primary'}
					htmlType={'submit'}
					size={'large'}
					style={{
						fontSize: '18px',
						height: '48px',
						width: '100%',
					}}
				>
					{submitText}
				</Button>
			</Form.Item>
		</Form>
	);
}
