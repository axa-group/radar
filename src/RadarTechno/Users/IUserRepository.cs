using System.Collections.Generic;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace RadarTechno.Users
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> FindAllAsync();
        Task<User> FindByIdAsync(string id, FindOptions options = null);
        Task<IEnumerable<User>> FindEntityUsers(string entityId, FindOptions options = null);
        Task<User> FindOneByEmailAsync(string email, FindOptions options = null);
        Task<ReplaceOneResult> ReplaceOneAsync(string id, User replacement, UpdateOptions options = null);
        Task SaveAsync(User element);
        Task<ReplaceOneResult> PromoteToEntityAdmin(string email, string entityId);
        Task<ReplaceOneResult> DemoteToUser(string email, string entityId);
    }
}