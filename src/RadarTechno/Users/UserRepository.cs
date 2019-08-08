using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace RadarTechno.Users
{
    public class UserRepository : IUserRepository
    {
        public IMongoCollection<User> _collection { get; set; }

        public UserRepository(IRadarDatabase radarDatabase)
        {
            _collection = radarDatabase.GetCollection<User>("users");
        }
        public async Task<IEnumerable<User>> FindAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<User> FindByIdAsync(string id, FindOptions options = null)
        {
            var filter = Builders<User>.Filter.Eq("_id", new ObjectId(id));
            return await _collection.Find(filter, options).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<User>> FindEntityUsers(string entityId, FindOptions options = null)
        {
            return await _collection.Find(user => user.EntityList[0] == entityId).ToListAsync();
        }

        public async Task<User> FindOneByEmailAsync(string email, FindOptions options = null)
        {
            var filterDefinition = Builders<User>.Filter.Where(p => p.Email.ToLower() == email.ToLower());
            return await _collection.Find(filterDefinition, options).FirstOrDefaultAsync();
        }

        public async Task<ReplaceOneResult> ReplaceOneAsync(string id, User replacement, UpdateOptions options = null)
        {
            var filter = Builders<User>.Filter.Eq("_id", new ObjectId(id));
            return await _collection.ReplaceOneAsync(filter, replacement, options);
        }

        public async Task SaveAsync(User element)
        {
            await _collection.InsertOneAsync(element);
        }

        public async Task<ReplaceOneResult> PromoteToEntityAdmin(string email, string entityId)
        {
            var user = await FindOneByEmailAsync(email);
            if (user == null)
            {
                throw new UserException("User not found");
            }
            if (user.EntityList[0] != entityId)
            {
                throw new UserException("User can't be administrator of an other entity");
            }
            user.Role = "admin";
            return await ReplaceOneAsync(user.Id, user);
        }

        public async Task<ReplaceOneResult> DemoteToUser(string email, string entityId)
        {
            var user = await FindOneByEmailAsync(email);
            if (user == null)
            {
                throw new UserException("User not found");
            }
            if (user.Role != "admin" && user.EntityList[0] != entityId)
            {
                throw new UserException("User is not an administrator of this entity");
            }
            user.Role = "user";
            return await ReplaceOneAsync(user.Id, user);
        }

    }
}
