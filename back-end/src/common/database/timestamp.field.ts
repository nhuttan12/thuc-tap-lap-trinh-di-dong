import { CreateDateColumn } from 'typeorm';

export class TimestampField {
	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		name: 'created_at',
	})
	createdAt: Date;

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		name: 'updated_at',
	})
	updatedAt: Date;
}
