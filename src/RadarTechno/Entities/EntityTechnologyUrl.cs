using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace RadarTechno.Entities
{
    public class EntityTechnologyUrl
    {
        [BsonElement("label")]
        public string Label { get; set; }

        [Url]
        [BsonElement("url")]
        public string Url { get; set; }
    }
}
