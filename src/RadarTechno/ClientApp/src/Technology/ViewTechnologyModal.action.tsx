import { IFormattedEntityTechnology } from '../Entity';
import { ITechnology } from './Technology';

export const convertEntitiesStatusToRadarTechnologies = (item: ITechnology) => {
  const radarTechnologies: IFormattedEntityTechnology[] = [];

  item.entitiesStatus.forEach(entityStatus => {
    radarTechnologies.push({
      ...item,
      name: entityStatus.entityName,
      technologyId: entityStatus.entityId,
      status: entityStatus.status,
    });
  });
  return radarTechnologies;
};
