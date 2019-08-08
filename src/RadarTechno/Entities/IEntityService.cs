using System.Collections.Generic;

namespace RadarTechno.Entities
{
    public interface IEntityService
    {
        IEnumerable<EntityTechnology> PopulateEntityTechnologiesGroupStatus(
            IEnumerable<EntityTechnology> entityTechnologies,
            IEnumerable<EntityTechnology> referenceEntityTechnologies);
    }
}