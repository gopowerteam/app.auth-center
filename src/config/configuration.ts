import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const env =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

const YAML_CONFIG_FILENAME = `.config.${env}.yml`;

console.log(YAML_CONFIG_FILENAME);
const RElATIVE_PATH = ['..', '..'];
export default () => {
  return yaml.load(
    readFileSync(
      join(__dirname, ...RElATIVE_PATH, YAML_CONFIG_FILENAME),
      'utf8',
    ),
  ) as Record<string, any>;
};
