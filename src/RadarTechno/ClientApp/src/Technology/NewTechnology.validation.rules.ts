import { rulesMaxLength, rulesRequired } from '../generic/rules';
import {
  CATEGORY,
  DESCRIPTION,
  NAME,
  SCOPE,
} from './Technology.constants';

export const rules = {
  [NAME]: [rulesRequired, rulesMaxLength()],
  [CATEGORY]: [rulesRequired],
  [DESCRIPTION]: [rulesMaxLength(4096)],
  [SCOPE]: [rulesMaxLength(4096)]
};
