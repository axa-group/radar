import { ITechnology } from '../Technology';

export interface IEntityTechnologyUrls {
  label: string;
  url: string;
}

export interface IEntity {
  id?: string;
  name: string;
  admins?: string;
  adminList?: string[];
  technologies?: IEntityTechnology[];
  workflowUrl?: string;
  numberOfTechnologies?: number;
  version?: number;
}

export interface IEntityTechnology {
  id: string;
  technologyId: string;
  status: string;
  groupStatus?: string;
  entityScope?: string;
  entityTechnologyUrls?: IEntityTechnologyUrls[];
}

export interface IPopulatedEntityTechnology {
  id: string;
  technologyId: string;
  status: string;
  groupStatus?: string;
  entityScope?: string;
  scope: string;
  entityTechnologyUrls?: IEntityTechnologyUrls[];
  technology: ITechnology;
}

export interface IFormattedEntityTechnology extends ITechnology, IEntityTechnology {

}
