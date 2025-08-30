import { number, object, ObjectSchema, string } from 'joi';

/**
 * @description: Validate data from YAML file, validate the configuration object
 * @returns {ObjectSchema} - the configuration object
 * @author: Nhut Tan
 * @date: 2025-08-30
 * */
export const validationSchema: ObjectSchema = object({
  database: object({
    host: string().required(),
    port: number().required(),
    username: string().required(),
    password: string().required(),
    database: string().required(),
  }).required(),
  http: object({
    port: number().required(),
  }).required(),
}).required();
