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

const YAML_CONFIG_FILENAME = 'config.env.yaml';

export default (): AppConfig => {
  return load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as AppConfig;
};
