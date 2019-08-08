using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace RadarTechno.History
{
    public class HistoryRepository : IHistoryRepository
    {
        public IMongoCollection<History> _collection { get; set; }


        public HistoryRepository(IRadarDatabase radarDatabase)
        {
            _collection = radarDatabase.GetCollection<History>("history");
        }

        public async Task<IEnumerable<History>> FindByElementIdAsync(
            string id, string type, string entityId = null, FindOptions options = null)
        {
            var builder = Builders<History>.Filter;
            var filter = builder.Eq(history => history.ElementId, id)
                         & builder.Eq(history => history.Type, type);
            return await _collection
                .Find(filter, options)
                .SortByDescending(history => history.UpdateDate)
                .ToListAsync();
        }

        public async Task SaveAsync(History element)
        {
            await _collection.InsertOneAsync(element);
        }
    }
}
