/**
 * @description Response from get user api
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-12
 */
export interface GetUserResponse {
	id: string;
	username: string;
	role: string;
	email: string;
	phone: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}