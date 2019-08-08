using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RadarTechno.Technologies;

namespace RadarTechno.Entities
{
    public class EntityTechnology
    {
        public EntityTechnology(string technologyId, string status, EntityTechnologyUrl[] entityTechnologyUrls)
        {
            InternalId = ObjectId.GenerateNewId();
            TechnologyId = technologyId;
            Status = status;
            EntityTechnologyUrls = entityTechnologyUrls;
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        internal ObjectId InternalId { get; set; }

        [BsonIgnore]
        public string Id
        {
            get { return InternalId.ToString(); }
            set
            {
                InternalId = new ObjectId(value);
            }
        }

        [Required]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("technology")]
        public string TechnologyId { get; set; }

        [Required]
        [BsonElement("status")]
        public string Status { get; set; }

        [BsonElement("scope")]
        public string Scope { get; set; }

        [BsonElement("entityTechnologyUrls")]
        public EntityTechnologyUrl[] EntityTechnologyUrls { get; set; } = null;

        [BsonIgnore]
        public Technology Technology { get; set; }

        [BsonIgnore]
        public string GroupStatus { get; set; }

        public void UpdateEntityTechnology(EntityTechnology entityTechnology)
        {
            Status = entityTechnology.Status;
            EntityTechnologyUrls = entityTechnology.EntityTechnologyUrls;
            Scope = entityTechnology.Scope;
        }
    }
}
