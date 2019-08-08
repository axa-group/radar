using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using RadarTechno.Technologies;

namespace RadarTechno.Entities
{
    public interface IEntityRepository
    {
        Task<IEnumerable<Entity>> FindAllAsync();
        Task<Entity> FindByIdAsync(string id, FindOptions options = null);
        Task<EntityTechnology> FindTechnologyByIdAsync(string entityId, string technologyId, FindOptions options = null);
        Task<ReplaceOneResult> ReplaceOneAsync(string id, Entity replacement, UpdateOptions options = null);
        Task SaveAsync(Entity element);
        Task<UpdateResult> UpdateOneAsync(string id,
            string field, object value, UpdateOptions options = null);

        Task<ReplaceOneResult> UpdateEntityTechnology(string entityId, EntityTechnology entityTechnology);

        Task<IEnumerable<EntityTechnology>> FindTechnologies(
            ITechnologyRepository technologyRepository,string entityId);

        Task<EntityTechnology> PopulateEntityTechnologies(string entityId, string technologyId,
            ITechnologyRepository technologyRepository);

        Task<UpdateResult> AddTechnology(EntityTechnology entityTechnology, string id,
            ITechnologyRepository technologyRepository);
        Task<ReplaceOneResult> AddAdminToAdminList(string email, string entityId);
        Task<ReplaceOneResult> RemoveAdminFromAdminList(string email, string entityId);
    }
}