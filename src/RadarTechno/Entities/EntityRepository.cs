using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using RadarTechno.Technologies;

namespace RadarTechno.Entities
{
    public class EntityRepository : IEntityRepository
    {
        public IMongoCollection<Entity> _collection { get; set; }

        public EntityRepository(IRadarDatabase radarDatabase)
        {
            _collection = radarDatabase.GetCollection<Entity>("entities");
        }
        public async Task<IEnumerable<Entity>> FindAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Entity> FindByIdAsync(string id, FindOptions options = null)
        {
            var filter = Builders<Entity>.Filter.Eq("_id", new ObjectId(id));
            return await _collection.Find(filter, options).FirstOrDefaultAsync();
        }

        public async Task<EntityTechnology> FindTechnologyByIdAsync(string entityId, string technologyId, FindOptions options = null)
        {
            var entity = await FindByIdAsync(entityId);
            var technologyList = entity.Technologies.ToList();
            var index = technologyList.FindIndex(t => t.TechnologyId == technologyId);
            return technologyList[index];
        }

        public async Task<ReplaceOneResult> ReplaceOneAsync(string id, Entity replacement, UpdateOptions options = null)
        {
            var filter = Builders<Entity>.Filter.Eq("_id", new ObjectId(id));
            return await _collection.ReplaceOneAsync(filter, replacement, options);
        }

        public async Task SaveAsync(Entity element)
        {
            await _collection.InsertOneAsync(element);
        }

        public async Task<UpdateResult> UpdateOneAsync(string id,
            string field, object value, UpdateOptions options = null)
        {
            var filter = Builders<Entity>.Filter.Eq("_id", new ObjectId(id));
            var update = Builders<Entity>.Update.Set(field, value);
            return await _collection.UpdateOneAsync(filter, update, options);
        }

        public async Task<ReplaceOneResult> UpdateEntityTechnology(string entityId, EntityTechnology entityTechnology)
        {
            var entity = await FindByIdAsync(entityId);
            var technologyList = entity.Technologies.ToList();
            var index = technologyList.FindIndex(t => t.TechnologyId == entityTechnology.TechnologyId);
            entity.Technologies[index].UpdateEntityTechnology(entityTechnology);
            return await ReplaceOneAsync(entityId, entity);
        }

        public async Task<IEnumerable<EntityTechnology>> FindTechnologies(
            ITechnologyRepository technologyRepository,string entityId)
        {
            var entity = await FindByIdAsync(entityId);
            if(entity.Technologies != null && entity.Technologies.Length > 0) {
                List<EntityTechnology> technologyList = entity.Technologies.ToList();
                for (var i = 0; i < technologyList.Count; i++)
                {
                    technologyList[i] = 
                        await PopulateEntityTechnologies(entityId, technologyList[i].TechnologyId, technologyRepository);
                }

                return technologyList;
            }
            return null;
        }

        public async Task<EntityTechnology> PopulateEntityTechnologies(string entityId, string technologyId, 
            ITechnologyRepository technologyRepository)
        {
            var newEntityTechnology = await FindTechnologyByIdAsync(entityId, technologyId);
            newEntityTechnology.Technology = await technologyRepository.FindByIdAsync(technologyId);
            return newEntityTechnology;
        }

        public async Task<UpdateResult> AddTechnology(EntityTechnology entityTechnology, string id,
            ITechnologyRepository technologyRepository)
        {
            var entity = await FindByIdAsync(id);
            var technology = await technologyRepository.FindByIdAsync(entityTechnology.TechnologyId);
            if (technology == null)
            {
                throw new ArgumentException("Invalid technology id");
            }
            var technologies = entity.Technologies;
            if (technologies != null && technologies.Length > 0)
            {
                if (technologies.Any(t => t.TechnologyId == entityTechnology.TechnologyId))
                    throw new ArgumentException("This technology is already in your entity");
                Array.Resize(ref technologies, technologies.Length + 1);
                technologies[technologies.GetUpperBound(0)] = entityTechnology;
            }
            else
            {
                technologies = new EntityTechnology[1];
                technologies[0] = entityTechnology;
            }
            return await UpdateOneAsync(id, "technologies", technologies);
        }

        public async Task<ReplaceOneResult> AddAdminToAdminList(string email, string entityId)
        {
            var entity = await FindByIdAsync(entityId);
            if (entity == null)
            {
                throw new ArgumentException("Entity not found");
            }
            var newAdminList = entity.AdminList;
            Array.Resize(ref newAdminList, newAdminList.Length + 1);
            newAdminList[newAdminList.GetUpperBound(0)] = email;
            var newEntity = entity;
            newEntity.AdminList = newAdminList;
            return await ReplaceOneAsync(entityId, newEntity);
        }

        public async Task<ReplaceOneResult> RemoveAdminFromAdminList(string email, string entityId)
        {
            var entity = await FindByIdAsync(entityId);
            if (entity == null)
            {
                throw new ArgumentException("Entity not found");
            }
            var newAdminList = entity.AdminList.Where(admin => admin != email).ToArray();
            var newEntity = entity;
            newEntity.AdminList = newAdminList;
            return await ReplaceOneAsync(entityId, newEntity);
        }
    }
}