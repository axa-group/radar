import { IEntity, IFormattedEntityTechnology } from '../Entity';
import { IEntitiesStatus, ITechnology } from '../Technology';
import { IUser } from '../User/User';

export const getExcelExportLink = (
  items: object[], 
  formatObject: (items: object[], fields: string[]) => string[], 
  createUrl: (blob: Blob) => string
) => {
  if(items && items.length) {
    const fields = Object.keys(items.reduce((result, obj) => {
      return Object.assign(result, obj);
    }, {}));
    const csv = formatObject(items, fields);
    const blob = new Blob([csv.join('\r\n')], { type:'data:text/csv;charset=utf-8;' });
    return createUrl(blob);
  }
  return '#';
};

export const SECURITY_PREVENT = "[character-removed-by-security]";

export const formatItems = (items: object[], fields: string[]) => {
  const csv = items.map((row) => {
    return fields.map((fieldName) => {
      return row[fieldName] === null ? '' : row[fieldName].toString().replace(/^(=|\+|-|@)/i, SECURITY_PREVENT).replace(/(\r\n|\n|\r)/gm, '');
    }).join(';');
  });
  csv.unshift(fields.join(';'));
  return csv;
};

export const formatUsers = (items: IUser[], fields: string[]) => {
  const newFields = fields;
  newFields.splice(fields.indexOf('entity'), 1);
  return formatItems(items, newFields);
};

export const formatEntities = (items: IEntity[], fields: string[]) => {
  const newFields = fields;
  newFields.splice(fields.indexOf('technologies'), 1);
  newFields.splice(fields.indexOf('admins'), 1);
  return formatItems(items, newFields);
};

export const formatEntityTechnologies = (items: IFormattedEntityTechnology[], fields: string[]) => {
  const newFields = fields;
  newFields.splice(fields.indexOf('entityTechnologyUrls'), 1);
  newFields.splice(fields.indexOf('entitiesStatus'), 1);
  return formatItems(items, newFields);
};

export const formatTechnologies = (items: ITechnology[], fields: string[]) => {
  const entityFields = [];
  items.forEach((item: ITechnology) => {
    item.entitiesStatus.forEach(entityStatus => {
      if(!entityFields.includes(entityStatus.entityName)) {
        entityFields.push(entityStatus.entityName);
      }
    });
  });
  fields.splice(fields.indexOf('entitiesStatus'), 1, ...entityFields);
  const csv = items.map((row: ITechnology) => {
    return fields.map((fieldName) => {
      if(entityFields.includes(fieldName)) {
        const statuses: IEntitiesStatus[] = row.entitiesStatus;
        const entityFieldStatus = statuses.find(s => s.entityName === fieldName);
        return entityFieldStatus !== undefined ? entityFieldStatus.status.toString().replace(/(\r\n|\n|\r)/gm, '') : '';
      }
      return row[fieldName] === null ? '' : row[fieldName].toString().replace(/(\r\n|\n|\r)/gm, '');
    }).join(';');
  });
  csv.unshift(fields.join(';'));
  return csv;
};
