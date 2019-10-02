using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Mongo2Go;
using MongoDB.Driver;
using RadarTechno.History;
using Xunit;

namespace RadarTechno.tests.History
{
    public class HistoryRepositoryTests
    {
        private readonly HistoryRepository _repository;
        private IRadarDatabase _database;
        internal readonly MongoDbRunner _mongoRunner;

        public HistoryRepositoryTests()
        {
            RadarTechno.History.History[] histories = new[]
            {
                new RadarTechno.History.History("author", "entity-technology", "id1", "diff"),
                new RadarTechno.History.History("author", "entity-technology", "id1", "diff2"),
                new RadarTechno.History.History("author", "entity-technology", "id1", "diff3"),
                new RadarTechno.History.History("author", "entity-technology", "id2", "diff")
            };

            _mongoRunner = MongoDbRunner.Start();
            MongoClient client = new MongoClient(_mongoRunner.ConnectionString);
            IMongoDatabase database = client.GetDatabase("radar-techno");
            var collection = database.GetCollection<RadarTechno.History.History>("history");
            collection.InsertMany(histories);
            var databaseSettings = new DatabaseSettings()
            {
                ConnectionString = _mongoRunner.ConnectionString,
                Database = "radar-techno"
            };
            IOptions<DatabaseSettings> options = Options.Create<DatabaseSettings>(databaseSettings);
            _database = new RadarDatabase(options);
            _repository = new HistoryRepository(_database);
        }

        [Fact]
        public async Task FindByElementIdAsyncShouldReturnAHistoryEnumerable()
        {
            var result = await _repository.FindByElementIdAsync("id1", "entity-technology");
            Assert.IsAssignableFrom<IEnumerable<RadarTechno.History.History>>(result);
            Assert.Equal(3, Enumerable.Count(result));
        }

        [Fact]
        public async Task SaveAsyncShouldInsertHistory()
        {
            var history = new RadarTechno.History.History("author", "entity-technology", "id1", "diff4");
            await _repository.SaveAsync(history);
            var result = await _repository.FindByElementIdAsync("id1", "entity-technology");
            Assert.IsAssignableFrom<IEnumerable<RadarTechno.History.History>>(result);
            Assert.Equal(4, Enumerable.Count(result));
        }
    }
}
