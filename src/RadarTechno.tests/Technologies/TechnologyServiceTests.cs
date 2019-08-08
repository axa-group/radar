using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RadarTechno.Entities;
using RadarTechno.Technologies;
using Xunit;

namespace RadarTechno.tests.Technologies
{
    public class TechnologyServiceTests
    {
        [Fact]
        public void SetEntityStatusWithEmptyEntityTechnologiesShouldNotModifyEntitiesStatus()
        {
            var technologyService = new TechnologyService();
            var technology = new Technology("C++", "c++", "Languages and Frameworks", "", "");
            var entity = new Entity()
            {
                Name = "1",
                Id = "5c73c15a8b89521e44e98804",
                Technologies = new EntityTechnology[0]
            };

            var newTechnology = technologyService.SetEntityStatus(technology, entity, "id");

            Assert.Equal(technology.EntitiesStatus, newTechnology.EntitiesStatus);
        }

        [Fact]
        public void SetEntityStatusShouldUpdateTechnologyEntitiesStatus()
        {
            var technologyService = new TechnologyService();
            var technology = new Technology("C++", "c++", "Languages and Frameworks", "", "");
            var entity = new Entity()
            {
                Name = "1",
                Id = "5c73c15a8b89521e44e98804",
                Technologies = new EntityTechnology[]
                {
                    new EntityTechnology(technology.Id, "Status", new EntityTechnologyUrl[0]),
                }
            };
            var expected =
                new EntityStatus() {EntityId = entity.Id, EntityName = entity.Name, Status = "Status"};

            var newTechnology = technologyService.SetEntityStatus(technology, entity, "id");
            var actual = newTechnology.EntitiesStatus.First();

            Assert.Equal(expected.Status, actual.Status);
            Assert.Equal(expected.EntityName, actual.EntityName);
            Assert.Equal(expected.EntityId, actual.EntityId);
        }

        [Fact]
        public void SetEntityStatusShouldUpdateTechnologyGroupStatus()
        {
            var technologyService = new TechnologyService();
            var technology = new Technology("C++", "c++", "Languages and Frameworks", "", "");
            var entity = new Entity()
            {
                Name = "1",
                Id = "5c73c15a8b89521e44e98804",
                Technologies = new EntityTechnology[]
                {
                    new EntityTechnology(technology.Id, "Status", new EntityTechnologyUrl[0]),
                }
            };

            var newTechnology = technologyService.SetEntityStatus(technology, entity, "5c73c15a8b89521e44e98804");

            Assert.Equal("Status", newTechnology.GroupStatus);
        }
    }
}
