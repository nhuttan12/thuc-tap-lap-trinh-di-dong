/**
 * @description: Load configuration from a YAML file, the file name is `config.env.yaml`
 * and it's located in the root folder
 * @returns {AppConfig} - the configuration object
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @version: 1.0.0
 * */

import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { AppConfig } from './interface/app.interface';
import { Logger } from '@nestjs/common';
import { cwd } from 'process';
import { validationSchema } from './validation/validation.schema';
import { ValidationErrorItem, ValidationResult } from 'joi';

/*
 * Config file to load environment variable
 * */
const YAML_CONFIG_FILENAME = 'config.env.yaml';

/*
 * Import logger from NestJS
 * */
const logger: Logger = new Logger('Configuration');

export default (): AppConfig => {
  const filePath: string = join(cwd(), YAML_CONFIG_FILENAME);

  logger.debug(`File path: ${filePath}`);

  const config: AppConfig = load(readFileSync(filePath, 'utf8')) as AppConfig;

  const result: ValidationResult = validationSchema.validate(config, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    logger.error(
      `Configuration validation error:\n${result.error.details
        .map((d: ValidationErrorItem): string => `- ${d.message}`)
        .join('\n')}`,
    );
    throw new Error(
      `Configuration validation error:\n${result.error.details
        .map((d: ValidationErrorItem): string => `- ${d.message}`)
        .join('\n')}`,
    );
  }

  return result.value as AppConfig;
};
