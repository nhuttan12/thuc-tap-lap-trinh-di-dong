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
	CANCELED = 'CANCELED',    // Note: 1 chữ L
	ON_HOLD = 'ON_HOLD',
	DELETED = 'DELETED'       // Giữ lại cho soft delete
}