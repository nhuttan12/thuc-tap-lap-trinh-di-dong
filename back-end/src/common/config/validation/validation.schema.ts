/**
 * @description: Validate data from YAML file, validate the configuration object
 * @returns {ObjectSchema} - the configuration object
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @modifies: 2025-09-14
 * @version: 1.0.2
 * */

import * as Joi from 'joi';

export const envValidationSchema: Joi.ObjectSchema = Joi.object({
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  HTTP_PORT: Joi.number().required(),
  HTTP_ENVIRONMENT: Joi.string().required(),
  HTTP_JWT_SECRET: Joi.string().required(),
  HTTP_EXPIRE_TIME: Joi.string().required(),
});
