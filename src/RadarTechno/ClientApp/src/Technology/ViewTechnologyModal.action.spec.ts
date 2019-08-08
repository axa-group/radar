import { IFormattedEntityTechnology } from "../Entity";
import { ITechnology } from "./Technology";
import { convertEntitiesStatusToRadarTechnologies } from "./ViewTechnologyModal.action";

describe('ViewTechnologyModal action test', () => {
  test('convertEntitiesStatusToRadarTechnologies should return radarTechnologies', () => {
      
  const technology: ITechnology = {
    updateDate: new Date("2019-02-27T15:28:49.294Z"),
    id: "5823926b69170e15d895fda0",
    version: 0,
    category: "tools",
    name: "Solution de parametrage",
    key: "solution-de-parametrage",
    scope: "scope",
    description: "description",
    entitiesStatus: [
      {entityId: "1", entityName: "AXA France", status: "assess"},
      {entityId: "2", entityName: "AXA UK", status: "reinforce"}
    ],
    groupStatus: "reinforce"
  };

  const expected: IFormattedEntityTechnology[] = [
    {
      ...technology,
      technologyId: technology.entitiesStatus[0].entityId,
      groupStatus: technology.groupStatus,
      status: technology.entitiesStatus[0].status,
      name: technology.entitiesStatus[0].entityName
    },
    {
      ...technology,
      technologyId: technology.entitiesStatus[1].entityId,
      groupStatus: technology.groupStatus,
      status: technology.entitiesStatus[1].status,
      name: technology.entitiesStatus[1].entityName
    },
  ];

  const actual = convertEntitiesStatusToRadarTechnologies(technology);

  expect(actual).toEqual(expected);
  });
});
