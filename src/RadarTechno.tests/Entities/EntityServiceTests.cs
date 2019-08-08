using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RadarTechno.Entities;
using Xunit;

namespace RadarTechno.tests.Entities
{
    public class EntityServiceTests
    {
        [Fact]
        public void PopulateEntityTechnologiesGroupStatusShouldReturnOriginalEntityTechnologies()
        {
            var entity = new Entity()
            {
                Name = "1",
                Id = "5c73c15a8b89521e44e98804",
                Technologies = new EntityTechnology[]
                {
                    new EntityTechnology("5c73c15a8b89521e44e98805", "Status", new EntityTechnologyUrl[0]),
                }
            };
            var technologies = new EntityService().PopulateEntityTechnologiesGroupStatus(entity.Technologies, new List<EntityTechnology>());
            Assert.Equal(entity.Technologies, technologies);
        }

        [Fact]
        public void PopulateEntityTechnologiesGroupStatusShouldReturnNull()
        {
            var technologies = new EntityService().PopulateEntityTechnologiesGroupStatus(null, null);
            Assert.Null(technologies);
        }

        [Fact]
        public void PopulateEntityTechnologiesGroupStatusShouldReturnEntityTechnologiesWithGroupStatus()
        {
            var entity = new Entity()
            {
                Name = "1", Id = "5c73c15a8b89521e44e98804", Technologies = new EntityTechnology[]
                {
                    new EntityTechnology("5c73c15a8b89521e44e98805", "Status", new EntityTechnologyUrl[0]),
                }
            };
            var refEntity = new Entity()
            {
                Name = "2", Id = "5c73c15a8b89521e44e98806", Technologies = new EntityTechnology[]
                {
                    new EntityTechnology("5c73c15a8b89521e44e98805", "GroupStatus", new EntityTechnologyUrl[0]),
                }
            };

            var technologies = new EntityService().PopulateEntityTechnologiesGroupStatus(entity.Technologies, refEntity.Technologies);

            Assert.Equal(technologies.First().Status, entity.Technologies.First().Status);
            Assert.Equal(technologies.First().GroupStatus, refEntity.Technologies.First().Status);
        }
    }
}
