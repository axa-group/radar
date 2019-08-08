using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using RadarTechno.Entities;

namespace RadarTechno.Technologies
{
    public interface ITechnologyRepository
    {
        Task<IEnumerable<Technology>> FindTechnologiesNotInEntity(
            IEntityRepository entityRepository, string entityId);

        Task<Technology> FindByIdAsync(string id, FindOptions options = null);

        Task<IEnumerable<Technology>> FindAllAsync();

        Task<ReplaceOneResult> ReplaceOneAsync(string id, Technology replacement, UpdateOptions options = null);

        Task SaveAsync(Technology technology);
    }
}