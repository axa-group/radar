using RadarTechno.Entities;

namespace RadarTechno.Technologies
{
    public interface ITechnologyService
    {
        Technology SetEntityStatus(Technology technology, Entity entity,
            string referenceEntityId);
    }
}