import { IEntity, IPopulatedEntityTechnology } from './Entity';

export const formatEntityTechnology = (items: IPopulatedEntityTechnology[]) => (
  items.map((entityTechnology: IPopulatedEntityTechnology) => {
    return {
      ...entityTechnology.technology,
      id: entityTechnology.id,
      status: entityTechnology.status,
      groupStatus: entityTechnology.groupStatus,
      entityScope: entityTechnology.scope,
      entityTechnologyUrls: entityTechnology.entityTechnologyUrls,
      technologyId: entityTechnology.technology.id
    };
  })
);

export const formatEntity = (items: IEntity[]) => (
  items.map((entity: IEntity) => {
    return {
      ...entity,
      numberOfTechnologies: entity.technologies ? entity.technologies.length : 0,
      admins: entity.adminList ? entity.adminList.toString() : '',
    };
  })
);
