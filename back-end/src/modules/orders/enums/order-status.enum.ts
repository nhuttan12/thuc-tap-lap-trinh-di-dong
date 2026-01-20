/*
 * @description Order status enum
 * @author Nhut Tan
 * @since 2025-09-07
 * @version 1.0.1
 */

// enums/order-status.enum.ts
export enum OrderStatusEnum {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
	CANCELED = 'CANCELED',
	ON_HOLD = 'ON_HOLD',
	DELETED = 'DELETED'
}