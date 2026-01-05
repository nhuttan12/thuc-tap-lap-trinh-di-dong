/**
 * @description Migration to create fk `image_id` column in `brands` table
 * reference `id` column in `images` table
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFKImageIDBrandsTableReferenceImagesTableIDID1767287303375
	implements MigrationInterface
{
	/**
	 * @description Migration run creating fk `image_id` column in `brands` table
	 * reference `id` column in `images` table
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
                ALTER TABLE brands
                ADD CONSTRAINT fk_brand_image_id_to_images_id
                FOREIGN KEY (image_id)
                REFERENCES images(id)
                ON DELETE RESTRICT;
            `);
	}

	/**
	 * @description Migration run creating fk `image_id` column in `brands` table
	 * reference `id` column in `images` table
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE brands
            DROP CONSTRAINT fk_brand_image_id_to_images_id;
        `);
	}
}
