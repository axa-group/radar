import { rulesRequired } from '../generic/rules';
import { SCOPE, STATUS, TECHNOLOGY } from '../Technology/Technology.constants';
import { TECHNOLOGY_URLS } from './Entity.constants';

export const rules = {
  [TECHNOLOGY]: [rulesRequired],
  [STATUS]: [rulesRequired],
  [SCOPE]: [],
  [TECHNOLOGY_URLS]: []
};
