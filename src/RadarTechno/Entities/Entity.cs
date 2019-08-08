using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RadarTechno.Entities
{
    public class Entity
    {
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
        [StringLength(256, MinimumLength = 2)]
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("adminList")]
        public string[] AdminList { get; set; }

        [BsonElement("technologies")]
        public EntityTechnology[] Technologies { get; set; }

        [Url]
        [BsonElement("workflowUrl")]
        public string WorkflowUrl { get; set; }

        [BsonElement("__v")]
        public int Version { get; set; } = 0;
    }
}
