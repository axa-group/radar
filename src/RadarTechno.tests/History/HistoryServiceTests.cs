using Moq;
using RadarTechno.Users;
using System.Collections.Generic;
using System.Threading.Tasks;
using JsonDiffPatchDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RadarTechno.Entities;
using RadarTechno.History;
using RadarTechno.Technologies;
using Xunit;

namespace RadarTechno.tests.History
{
    public class HistoryServiceTests
    {

        public HistoryServiceTests()
        {
        }

        [Fact]
        public async Task AddHistoryToRepositoryCallsSaveAsync()
        {
            var entityList = new string[] { "entity" };
            var user = new User("nom", "mail", entityList, "user");
            var technology = new Technology("C#", "c#", "Languages and Frameworks", "new desc", "");
            var mockHistoryRepository = new Mock<IHistoryRepository>();
            var userService = new Mock<IUserService>();
            var historyMessage = new HistoryMessage()
                {Id = "id", Data = JsonConvert.SerializeObject(technology), Type = "technology", Author = ""};
            userService.Setup(m => m.GetById(It.IsAny<string>())).ReturnsAsync(user);
            mockHistoryRepository.Setup(m => m.FindByElementIdAsync(It.IsAny<string>(), It.IsAny<string>(), null, null))
                .ReturnsAsync(new List<RadarTechno.History.History>());
            HistoryService historyService = new HistoryService(null);
            await historyService.AddHistoryToRepository(historyMessage, mockHistoryRepository.Object, userService.Object);
            
            mockHistoryRepository.Verify(m => m.SaveAsync(It.IsAny<RadarTechno.History.History>()));
        }

        [Fact]
        public async Task GetDiffWithoutHistory()
        {
            var mockHistoryRepository = new Mock<IHistoryRepository>();
            HistoryService historyService =new HistoryService(null);
            var technology = new Technology("C#", "c#", "Languages and Frameworks", "new desc", "");

            var output = await historyService.GetDiff(
                mockHistoryRepository.Object, "technology", "", JsonConvert.SerializeObject(technology));

            Assert.IsType<string>(output);
        }


        [Fact]
        public async Task GetDiffWithElementHistory()
        {
            var technology = new Technology("C#", "c#", "Languages and Frameworks", "new desc", "");
            var historyList = new List<RadarTechno.History.History>();
            var diff = new
            {
                Name = new string[]
                {
                    "C",
                    "C++"
                },
                Key = new string[]
                {
                    "c",
                    "c++"

                },
                Description = new string[]
                {
                    "",
                    "desc"
                }
            };
            historyList.Add(new RadarTechno.History.History("", "technology", "", JsonConvert.SerializeObject(diff)));
            var mockHistoryRepository = new Mock<IHistoryRepository>();
            mockHistoryRepository.Setup(m => m.FindByElementIdAsync(It.IsAny<string>(), "technology", null, null))
                .ReturnsAsync(historyList);
            HistoryService historyService = new HistoryService(null);

            var output = await historyService.GetDiff(
                mockHistoryRepository.Object, "technology", "", JsonConvert.SerializeObject(technology));
            var deserializedOutput = JsonConvert.DeserializeObject(output);

            Assert.IsType<string>(output);
        }
    }
}
