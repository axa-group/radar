import {
  EMAIL,
  PASSWORD,
} from '../constants';
import {rulesMail, rulesMinLength, rulesRequired} from '../generic/rules';

export const rules = {
  [EMAIL]: [rulesRequired, rulesMail ],
  [PASSWORD]: [rulesRequired, rulesMinLength(7)],
};
