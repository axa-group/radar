import { IEntity } from '../Entity';

export interface ICurrentUser {
  email: string;
  entity: IEntity;
  id: string;
  role?: string;
  token: string;
}
