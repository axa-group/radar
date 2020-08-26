using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace RadarTechno.Technologies
{
    public class Technology
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

        [BsonElement("__v")]
        public int Version { get; set; } = 0;

        [Required]
        [StringLength(256)]
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("key")]
        public string Key { get; set; }

        [Required]
        [BsonElement("category")]
        public string Category { get; set; }

        [StringLength(4096)]
        [BsonElement("description")]
        public string Description { get; set; }

        [StringLength(4096)]
        [BsonElement("scope")]
        public string Scope { get; set; }

        [BsonElement("reporter")]
        public string Reporter { get; set; }

        [BsonIgnore] 
        public List<EntityStatus> EntitiesStatus { get; set; }

        [BsonIgnore]
        public string GroupStatus{ get; set; }

        [BsonElement("updateDate")]
        [BsonDateTimeOptions]
        public DateTime UpdateDate { get; set; } = DateTime.Now;

        public Technology()
        {
            
        }
        
        [JsonConstructor]
        public Technology(string name, string key, string category, string description, string scope)
        {
            Name = name;
            Key = key;
            Category = category;
            Description = description;
            Scope = scope;
            EntitiesStatus = new List<EntityStatus>();
        }

    }

    public static class TechnologyExtention
    {
        
        public static void Map(this Technology technology, Technology input )
        {
            technology.Id = input.Id;
            technology.InternalId = input.InternalId;
            technology.Version = input.Version;
            technology.Name = input.Name;
            technology.Key = input.Key;
            technology.Category = input.Category;
            technology.Description = input.Description;
            technology.Reporter = input.Reporter;
            technology.Scope = input.Scope;
            technology.EntitiesStatus = input.EntitiesStatus;
            technology.GroupStatus = input.GroupStatus;
            technology.UpdateDate = input.UpdateDate;
        }
    }
}
