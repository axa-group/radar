import { IEntity } from './Entity';

export interface IUser {
  id?: string;
  email: string;
  entity: IEntity;
  entityList?: string[];
  entityName?: string;
  name?: string;
  password?: string;
  role: string;
}

export interface IEditUser {
  id?: string;
  name?: string;
  entity: IEntity;
  role: string;
}
