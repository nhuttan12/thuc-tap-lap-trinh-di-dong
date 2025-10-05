/**
 * @description Validate data from YAML file, validate the configuration object
 * @returns {ObjectSchema} - the configuration object
 * @author Nhut Tan
 * @since 2025-08-30
 * @modifies 2025-09-23
 * @version 1.0.3
 */

import * as Joi from 'joi'

export const envValidationSchema: Joi.ObjectSchema = Joi.object({
	/**
	 * Database type for validation with `Joi`
	 */
	DATABASE_TYPE: Joi.string().required(),
	DATABASE_HOST: Joi.string().required(),
	DATABASE_PORT: Joi.number().required(),
	DATABASE_USERNAME: Joi.string().required(),
	DATABASE_PASSWORD: Joi.string().required(),
	DATABASE_NAME: Joi.string().required(),

	/**
	 * Http type for validation with `Joi`
	 */
	HTTP_PORT: Joi.number().required(),
	HTTP_ENVIRONMENT: Joi.string().required(),
	HTTP_JWT_SECRET: Joi.string().required(),
	HTTP_EXPIRE_TIME: Joi.string().required(),
	HTTP_SALT_ROUNDS_BCRYPT: Joi.number().required(),

	/**
	 * Google type for validation with `Joi`
	 */
	GOOGLE_CLIENT_ID: Joi.string().required(),
	GOOGLE_CLIENT_SECRET: Joi.string().required(),
	GOOGLE_CALLBACK_URL: Joi.string().required(),
	GOOGLE_ACCESS_TYPE: Joi.string().required(),
})
