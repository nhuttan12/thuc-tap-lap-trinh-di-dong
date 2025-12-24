/**
 * @description ErrorResponse interface
 * @author Nhut Tan
 * @since 2025-09-08
 * @version 1.0.0
 */

export interface ErrorResponse {
	statusCode: number;
	message: string | string[];
	error?: string;
	[key: string]: any;
}
