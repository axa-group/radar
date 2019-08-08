using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace RadarTechno.History
{
    public class History
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
        [BsonElement("author")]
        public string Author { get; set; }

        [Required]
        [BsonElement("type")]
        public string Type { get; set; }

        [Required]
        [BsonElement("elementId")]
        public string ElementId { get; set; }

        [Required]
        [BsonElement("diff")]
        public string Diff { get; set; }

        [BsonElement("updateDate")]
        public DateTime UpdateDate { get; set; } = DateTime.Now;

        public History(string author, string type, string elementId, string diff)
        {
            Author = author;
            Type = type;
            ElementId = elementId;
            Diff = diff;
        }
    }
}
