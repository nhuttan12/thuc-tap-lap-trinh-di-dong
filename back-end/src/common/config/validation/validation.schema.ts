/**
 * @description: Validate data from YAML file, validate the configuration object
 * @returns {ObjectSchema} - the configuration object
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @modifies: 2025-09-01
 * @version: 1.0.1
 * */

import { number, object, ObjectSchema, string } from 'joi';

export const envValidationSchema: ObjectSchema = object({
  DATABASE_TYPE: string().required(),
  DATABASE_HOST: string().required(),
  DATABASE_PORT: number().required(),
  DATABASE_USERNAME: string().required(),
  DATABASE_PASSWORD: string().required(),
  DATABASE_NAME: string().required(),

  HTTP_PORT: number().required(),
  HTTP_ENVIRONMENT: string().required(),
  HTTP_JWT_SECRET: string().required(),
  HTTP_EXPIRE_TIME: string().required(),
});
