using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Moq;
using RadarTechno.Technologies;
using Xunit;

namespace RadarTechno.tests.Technologies
{
    public class TechnologyRepositoryTests
    {
        private readonly bool isMock = false;

        public TechnologyRepositoryTests()
        {
            _databaseSettings = new DatabaseSettings
            {
                ConnectionString = "mongodb://localhost:27017",
                Database = "Test"
            };
            _options = new Mock<IOptions<DatabaseSettings>>();
            _options.Setup(m => m.Value).Returns(_databaseSettings);
        }

        private readonly DatabaseSettings _databaseSettings;

        private readonly Mock<IOptions<DatabaseSettings>> _options;

        private Mock<IRadarDatabase> MockObject<T>(Mock<IMongoCollection<T>> mongoCollectionMock)
        {
            var mock = new Mock<IRadarDatabase>();
            mock.Setup(pa => pa.GetCollection<T>("technos"))
                .Returns(mongoCollectionMock.Object);
            return mock;
        }
        
        [Fact]
        public async Task FindAllTechnologiesAsyncShouldFindAllDataInDatabase()
        {
            if (isMock) {
                var radarDatabase = new RadarDatabase(_options.Object);
                var technologyRepository = new TechnologyRepository(radarDatabase);
                var technologies = await technologyRepository.FindAllAsync();
                Assert.IsAssignableFrom<IEnumerable<Technology>>(technologies);
            }
        }

        [Fact]
        public async Task FindByIdAsyncShouldFindDataInDatabase()
        {
            if (isMock) {
                var radarDatabase = new RadarDatabase(_options.Object);
                var technologyRepository = new TechnologyRepository(radarDatabase);
                var id = "5c73c15a8b89521e44e98805";
                var technology = await technologyRepository.FindByIdAsync(id);
                Assert.IsType<Technology>(technology);
            }
        }

        [Fact]
        public async Task ReplaceOneAsyncShouldReplaceDataInDatabase()
        {
            var technology = new Technology("C#", "c#", "Languages and Frameworks", "", "");

            var mongoCollectionMock = new Mock<IMongoCollection<Technology>>();
            var radarDatabaseMock = MockObject(mongoCollectionMock);

            var technologyRepository = new TechnologyRepository(radarDatabaseMock.Object);
            var id = "5c73c15a8b89521e44e98805";
            await technologyRepository.ReplaceOneAsync(id, technology);

            mongoCollectionMock.Verify(m => m.ReplaceOneAsync(
                It.IsAny<FilterDefinition<Technology>>(),
                It.IsAny<Technology>(),
                It.IsAny<UpdateOptions>(),
                It.IsAny<CancellationToken>()));
        }
        
    }
}