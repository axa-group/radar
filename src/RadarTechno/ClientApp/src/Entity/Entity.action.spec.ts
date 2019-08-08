import { IFormattedEntityTechnology, IPopulatedEntityTechnology } from "./Entity";
import { formatEntity, formatEntityTechnology } from "./Entity.action";

describe('Entity action test', () => {
  test('formatEntityTechnology returns array of FormattedEntityTechnology', () => {
    const items: IPopulatedEntityTechnology[] = [{  
      id: "id",
      technologyId: "5823926b69170e15d895fda7",
      technology: {  
          "updateDate": new Date("2018-07-23T14:41:36.328Z"),
          "id": "5823926b69170e15d895fda7",
          "version": 0,
          "category": "frameworks",
          "name": "Node.JS",
          "scope": "",
          "key": "node.js"
      },
      scope: "",
      groupStatus: "Deprecated",
      status: "Excel"
    }];

    const expected: IFormattedEntityTechnology[] = [{
      "category": "frameworks", 
      "entityScope": "", 
      "entityTechnologyUrls": undefined, 
      "groupStatus": "Deprecated", 
      "id": "id", 
      "key": "node.js", 
      "name": "Node.JS", 
      "scope": "", 
      "status": "Excel", 
      "technologyId": "5823926b69170e15d895fda7", 
      "updateDate": new Date("2018-07-23T14:41:36.328Z"), 
      "version": 0
    }];
    const actual = formatEntityTechnology(items);

    expect(actual).toEqual(expected);
  });

  test('formatEntity returns array of foramtted Entity', () => {
    const fakeEntities = [{
      id:'5a4e2821a111b016c4cc5804',
      name:'AXA France',
      adminList:['Test@axa.fr'],
      technologies: [{ id: 'id', technologyId: '5823926b69170e15d895fda7', status: 'Excel', applicationUrl: '' }],
      version:0,
      workflowUrl: null
    }];
    const expected = [{...fakeEntities[0], numberOfTechnologies: 1, admins: 'Test@axa.fr'}];

    const actual = formatEntity(fakeEntities);

    expect(actual).toEqual(expected);
  });
});
