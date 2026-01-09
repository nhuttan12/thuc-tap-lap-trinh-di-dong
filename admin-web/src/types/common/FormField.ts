/**
 * @description Form field interface
 * @author @nhuttan12
 * @since 2025-11-14
 * @version 1.0.0
 */

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