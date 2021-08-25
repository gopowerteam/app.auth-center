import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yml';
const RElATIVE_PATH = ['..', '..'];
export default () => {
  return yaml.load(
    readFileSync(
      join(__dirname, ...RElATIVE_PATH, YAML_CONFIG_FILENAME),
      'utf8',
    ),
  ) as Record<string, any>;
};
