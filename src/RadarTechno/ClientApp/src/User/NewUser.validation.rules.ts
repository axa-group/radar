import { rulesMaxLength,rulesNoSpecialChars, rulesRequired } from '../generic/rules';
import { rules as loginRules } from '../Login/Login.validation.rules';
import { ENTITY, NAME, ROLE } from './User.constants';

export const rules = {
  ...loginRules,
  [NAME]: [rulesNoSpecialChars, rulesMaxLength() ],
  [ROLE]: [rulesRequired],
  [ENTITY]: [rulesRequired]
};
