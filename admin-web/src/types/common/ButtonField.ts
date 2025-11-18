/**
 * @description Button field type
 * @author @nhuttan12
 * @since 2025-11-16
 * @version 1.0.0
 */

import React from 'react';

/**
 * @description Button field interface
 * @property {string} name - Button name
 * @property {'submit' | 'reset' | 'button'} type - Button type
 * @property {function} onClick - Button click handler
 * @property {boolean} useTimeout - Use timeout or not
 */
export interface ButtonField {
	name: string;
	key: number | string;
	type: 'primary' | 'dashed' | 'text' | 'link' | 'default';
	htmlType?: 'submit' | 'reset' | 'button';
	onClick?: () => void;
	useTimeout?: boolean;
	disable?: (selectedRowKeys: React.Key[]) => boolean;
}
