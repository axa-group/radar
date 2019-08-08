using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using RadarTechno.Entities;

namespace RadarTechno.Technologies
{
    public class TechnologyRepository : ITechnologyRepository
    {
        public IMongoCollection<Technology> _collection { get; set; }

        public TechnologyRepository(IRadarDatabase radarDatabase)
        {
            _collection = radarDatabase.GetCollection<Technology>("technos");
        }
        public async Task<IEnumerable<Technology>> FindTechnologiesNotInEntity(
            IEntityRepository entityRepository, string entityId)
        {
            var entity = await entityRepository.FindByIdAsync(entityId);
            var technologies = await FindAllAsync();
            if (entity.Technologies != null && entity.Technologies.Length > 0)
            {
                var entityTechnologyIds = new HashSet<string>(entity.Technologies.Select(t => t.TechnologyId));
                technologies = technologies.Where(t => !entityTechnologyIds.Contains(t.Id));
            }
            return technologies;
        }
        public async Task<Technology> FindByIdAsync(string id, FindOptions options = null)
        {
            var filter = Builders<Technology>.Filter.Eq("_id", new ObjectId(id));
            return await _collection.Find(filter, options).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Technology>> FindAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<ReplaceOneResult> ReplaceOneAsync(string id, Technology replacement, UpdateOptions options = null)
        {
            var filter = Builders<Technology>.Filter.Eq("_id", new ObjectId(id));
            return await _collection.ReplaceOneAsync(filter, replacement, options);
        }
        
        public async Task SaveAsync(Technology technology)
        {
            var duplicate = await FindByIdAsync(technology.Id);
            if(duplicate != null)
                throw new ArgumentException($"Duplicate entry for technology {technology.Name}");
            await _collection.InsertOneAsync(technology);
        }
    }
}
