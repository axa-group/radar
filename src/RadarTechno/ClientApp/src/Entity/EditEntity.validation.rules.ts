// @ts-ignore max-line-length
// tslint:disable: max-line-length

import { rulesMaxLength, rulesMinLength, rulesNoSpecialChars ,rulesRequired, rulesUrl } from '../generic/rules';
import { ADMINLIST, NAME, WORKFLOW_URL } from './Entity.constants';

export const rules = {
  [NAME]: [rulesRequired, rulesMaxLength(), rulesMinLength(), rulesNoSpecialChars],
  [ADMINLIST]: [],
  [WORKFLOW_URL]: [rulesUrl]
};
