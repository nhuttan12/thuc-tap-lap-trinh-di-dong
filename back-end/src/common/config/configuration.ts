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
