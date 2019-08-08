import {
  EMAIL,
  PASSWORD,
} from '../constants';

export interface ILoginFields {
  [EMAIL]: { name: string, value: string, message: string };
  [PASSWORD]: { name: string,  value: string, message: string };
}
