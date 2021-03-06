﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace RadarTechno
{
    public class RadarDatabase : IRadarDatabase
    {
        private readonly IOptions<DatabaseSettings> _settings;

        public RadarDatabase(IOptions<DatabaseSettings> settings)
        {
            _settings = settings;
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            var databaseSettings = _settings.Value;
            var clientSettings = MongoClientSettings.FromUrl(MongoUrl.Create(databaseSettings.ConnectionString));

            var mongoSettings = new MongoClientSettings();
            mongoSettings.Server = clientSettings.Server;
            mongoSettings.Credential = clientSettings.Credential;

            var client = new MongoClient(mongoSettings);
            var db = client.GetDatabase(databaseSettings.Database);
            return db.GetCollection<T>(name);
        }

    }
}
