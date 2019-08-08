using System;
using System.Collections.Generic;
using System.Text;
using RadarTechno.Entities;
using Xunit;

namespace RadarTechno.tests.Entities
{
    public class EntityTechnologyTests
    {
        [Fact]
        public void UpdateEntityTechnologyChangesEntityTechnologyAttributes()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var newEntityTechnologyUrl = new EntityTechnologyUrl() { Label = "label", Url = "url" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var updatedEntityTechnology = new EntityTechnology("id2", "status", new EntityTechnologyUrl[] { newEntityTechnologyUrl });

            entityTechnology.UpdateEntityTechnology(updatedEntityTechnology);

            Assert.Equal(entityTechnology.Status, updatedEntityTechnology.Status);
            Assert.Equal(entityTechnology.EntityTechnologyUrls, updatedEntityTechnology.EntityTechnologyUrls);
        }
    }
}
