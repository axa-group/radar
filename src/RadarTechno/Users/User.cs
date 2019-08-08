using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using RadarTechno.Entities;

namespace RadarTechno.Users
{
    [BsonIgnoreExtraElements]
    public class User
    {
        public User(string name, string email, string[] entityList, string role)
        {
            Name = name;
            Email = email;
            EntityList = entityList;
            Role = role;
        }

        public User(RegisterUser registerUser)
        {
            Name = registerUser.Name;
            Email = registerUser.Email;
            EntityList = registerUser.EntityList;
            Role = registerUser.Role;
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        internal ObjectId InternalId { get; set; }

        [BsonIgnore]
        public string Id
        {
            get => InternalId.ToString();
            set => InternalId = new ObjectId(value);
        }

        [BsonElement("name")] public string Name { get; set; }

        [Required, EmailAddress]
        [BsonElement("email")] public string Email { get; set; }

        [Required]
        [BsonElement("entityList")] public string[] EntityList { get; set; }

        [BsonIgnore]
        public Entity Entity { get; set; }

        [Required]
        [BsonElement("role")] public string Role { get; set; }

        [BsonElement("passwordHash")]
        [JsonIgnore]
        public byte[] PasswordHash { get; set; }

        [BsonElement("passwordSalt")]
        [JsonIgnore]
        public byte[] PasswordSalt { get; set; }

        [BsonElement("provider")] public string Provider { get; set; }

        [BsonElement("__v")] public int Version { get; set; } = 0;
    }
}