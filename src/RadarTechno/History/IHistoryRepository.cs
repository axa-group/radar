using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace RadarTechno.History
{
    public interface IHistoryRepository
    {
        IMongoCollection<History> _collection { get; set; }
        Task<IEnumerable<History>> FindByElementIdAsync(
            string id, string type, string entityId = null, FindOptions options = null);
        Task SaveAsync(History element);
    }
}