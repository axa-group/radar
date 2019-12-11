using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore.Internal;

namespace RadarTechno.Entities
{
    public class EntityService : IEntityService
    {
        public IEnumerable<EntityTechnology> PopulateEntityTechnologiesGroupStatus(
            IEnumerable<EntityTechnology> entityTechnologies,
            IEnumerable<EntityTechnology> referenceEntityTechnologies)
        {
            var newEntityTechnologies = entityTechnologies;
            if (referenceEntityTechnologies != null && referenceEntityTechnologies.Any()
                && newEntityTechnologies!= null && newEntityTechnologies.Any())
            {
                var refEntityTechnologiesList = new List<EntityTechnology>(referenceEntityTechnologies);
                foreach (var entityTechnology in newEntityTechnologies)
                {
                    var index = refEntityTechnologiesList.FindIndex(technology =>
                        technology.TechnologyId == entityTechnology.TechnologyId);
                    if (index >= 0)
                    {
                        entityTechnology.GroupStatus = refEntityTechnologiesList[index].Status;
                    }
                }
            }
            return newEntityTechnologies;
        }
    }
}
