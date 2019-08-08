import { IEntity, IFormattedEntityTechnology } from "../Entity";
import { ITechnology } from "../Technology";
import { IUser } from "../User/User";
import { formatEntities, formatEntityTechnologies, formatItems, formatTechnologies, formatUsers, getExcelExportLink, SECURITY_PREVENT } from "./excelExport";

describe('excel export test', () => {
  test('getExcelExportLink returns url', () => {
    const fakeTechnologies = [{
      updateDate:'2018-07-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda7',
      version:0,
      category:'frameworks',
      name:'Node.JS',
      scope:null,
      key:'node.js',
    }];
    const createUrl = jest.fn();
    createUrl.mockReturnValue('url');
    const format = jest.fn();
    format.mockReturnValue([]);
    const result = getExcelExportLink(fakeTechnologies, format, createUrl);

    expect(result).toEqual('url');
  });

  test('getExcelExportLink without items returns #', () => {
    const createUrl = jest.fn();
    const format = jest.fn();
    const result = getExcelExportLink([], format, createUrl);

    expect(result).toEqual('#');
  });

  test('getExcelExportLink with null items returns #', () => {
    const createUrl = jest.fn();
    const format = jest.fn();
    const result = getExcelExportLink(null, format, createUrl);

    expect(result).toEqual('#');
  });

  test('formatItems returns formatted string', () => {
    const items = [
      {"1": "value1", "2": "value2"},
      {"1": "value3", "2": "value4"},
      {"1": "=value5", "2": "+value6"},
      {"1": "-value7", "2": "@value8"},
    ];
    const fields = ["1", "2"];

    const expected = ["1;2", "value1;value2", "value3;value4", `${SECURITY_PREVENT}value5;${SECURITY_PREVENT}value6`, `${SECURITY_PREVENT}value7;${SECURITY_PREVENT}value8`];
    const actual = formatItems(items, fields);

    expect(actual).toEqual(expected);
  });

  test('formatUsers returns formatted string', () => {
    const items: IUser[] = [
      {
        email: 'email',
        entity: null,
        id: 'id',
        role: 'user',
        entityList: [],
        name: 'name',
        entityName: 'AXA France'
      }
    ];
    const fields = Object.keys(items[0]);

    const expected = ["email;id;role;entityList;name;entityName", "email;id;user;;name;AXA France"];
    const actual = formatUsers(items, fields);

    expect(actual).toEqual(expected);
  });

  test('formatEntities returns formatted string', () => {
    const items: IEntity[] = [{
      id:'5a4e2821a111b016c4cc5804',
      name:'AXA France',
      adminList:['Test@axa.fr'],
      admins: 'Test@axa.fr',
      technologies: [],
      version:0,
    }];
    const fields = Object.keys(items[0]);

    const expected = ["id;name;adminList;version", "5a4e2821a111b016c4cc5804;AXA France;Test@axa.fr;0"];
    const actual = formatEntities(items, fields);

    expect(actual).toEqual(expected);
  });

  test('formatEntityTechnologies returns formatted string', () => {
    const items: IFormattedEntityTechnology[] = [{
      updateDate: new Date('2018-07-23T14:41:36.328Z'),
      technologyId:'5823926b69170e15d895fda7',
      version:0,
      category:'frameworks',
      name:'Node.JS',
      scope:'',
      key:'node.js',
      status: 'Excel',
      entityTechnologyUrls: [],
      entitiesStatus: null,
    }];
    const fields = Object.keys(items[0]);

    const expected = [
      "updateDate;technologyId;version;category;name;scope;key;status",
      `${new Date('2018-07-23T14:41:36.328Z').toString()};5823926b69170e15d895fda7;0;frameworks;Node.JS;;node.js;Excel`
    ];
    const actual = formatEntityTechnologies(items, fields);

    expect(actual).toEqual(expected);
  });

  test('formatTechnologies returns formatted string', () => {
    const items: ITechnology[] = [{
      updateDate: new Date('2018-07-23T14:41:36.328Z'),
      id:'5823926b69170e15d895fda7',
      version:0,
      category:'frameworks',
      name:'Node.JS',
      scope:'',
      key:'node.js',
      groupStatus:'Excel',
      entitiesStatus:[
        {entityName: 'AXA France', entityId: 'id', status:'Excel'},
        {entityName: 'AXA US', entityId: 'id', status:'Reinforce'}
      ]
    }];
    const fields = Object.keys(items[0]);

    const expected = [
      "updateDate;id;version;category;name;scope;key;groupStatus;AXA France;AXA US", 
      `${new Date('2018-07-23T14:41:36.328Z').toString()};5823926b69170e15d895fda7;0;frameworks;Node.JS;;node.js;Excel;Excel;Reinforce`];
    const actual = formatTechnologies(items, fields);

    expect(actual).toEqual(expected);
  });
});
