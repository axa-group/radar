export interface ITechnology {
  id?: string;
  category: string;
  description?: string;
  key: string;
  name: string;
  reporter?: string;
  scope?: string;
  updateDate?: Date;
  version?: number;
  entitiesStatus?: IEntitiesStatus[];
  groupStatus?: string;
}

export interface IEntitiesStatus {
  entityId: string;
  entityName: string;
  status: string;
}
