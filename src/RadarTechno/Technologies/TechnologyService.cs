using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RadarTechno.Entities;

namespace RadarTechno.Technologies
{
    public class TechnologyService : ITechnologyService
    {
        public Technology SetEntityStatus(Technology technology, Entity entity,
            string referenceEntityId)
        {
            Technology newTechnology = new Technology(technology);
            if (entity.Technologies != null && entity.Technologies.Length > 0)
            {
                var entityTechnologiesList = new List<EntityTechnology>(entity.Technologies);
                var index = entityTechnologiesList.FindIndex(entityTechnology =>
                    entityTechnology.TechnologyId == newTechnology.Id);
                if (index >= 0)
                {
                    if (referenceEntityId != null && referenceEntityId == entity.Id)
                    {
                        newTechnology.GroupStatus = entityTechnologiesList[index].Status;
                    }
                    else
                    {
                        newTechnology.EntitiesStatus.Add(
                            new EntityStatus()
                            {
                                EntityId = entity.Id,
                                Status = entityTechnologiesList[index].Status,
                                EntityName = entity.Name
                            }
                        );
                    }
                }
            }
            return newTechnology;
        }
    }
}
