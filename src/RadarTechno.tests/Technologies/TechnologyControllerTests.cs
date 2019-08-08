using System;
using Moq;
using Xunit;
using RadarTechno.Technologies;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json.Serialization;
using RadarTechno.Entities;
using RadarTechno.History;

namespace RadarTechno.tests.Technologies
{
    public class TechnologyControllerTests
    {
        private Mock<ITechnologyRepository> _mockRepository;
        private Mock<IEntityRepository> _mockEntityRepository;
        private TechnologyController _controller;

        public TechnologyControllerTests()
        {
            _mockRepository = new Mock<ITechnologyRepository>();
            _mockEntityRepository = new Mock<IEntityRepository>();
            var mockConfiguration = new Mock<IConfiguration>();
            var mockConfigurationSection = new Mock<IConfigurationSection>();
            mockConfigurationSection.SetupGet(m => m.Value).Returns("5c73c15a8b89521e44e98806");
            mockConfiguration.Setup(x => x.GetSection("ReferenceEntityId")).Returns(mockConfigurationSection.Object);
            _controller = new TechnologyController(mockConfiguration.Object);
        }

        [Fact]
        public async Task CreateTechnologyWithoutNameShouldReturnBadRequest()
        {
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "root"),
                        new Claim(ClaimTypes.Name, "")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var technology = new Technology(null, null, "Languages and Frameworks", "", "");

            var result = await _controller.CreateTechnology(_mockRepository.Object, mockQueue.Object, technology);

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task CreateTechnologyShouldSaveAsync()
        {
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "root"),
                        new Claim(ClaimTypes.Name, "") 
                    })),
                }
            };
            _controller.ControllerContext = context;
            var technology = new Technology("C++", "c++", "Languages and Frameworks", "", "");
            
            await _controller.CreateTechnology(_mockRepository.Object, mockQueue.Object, technology);

            _mockRepository.Verify(m => m.SaveAsync(It.IsAny<Technology>()));
            mockQueue.Verify(m => m.PublishAsync("history", It.IsAny<string>()));
        }

        [Fact]
        public async Task CreateTechnologyShouldCatchArgumentExceptionAndReturnBadRequest()
        {
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "root"),
                        new Claim(ClaimTypes.Name, "")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var technology = new Technology("C++", "c++", "Languages and Frameworks", "", "");
            _mockRepository.Setup(m => m.SaveAsync(It.IsAny<Technology>()))
                .ThrowsAsync(new ArgumentException("exception"));

            var result = await _controller.CreateTechnology(_mockRepository.Object, mockQueue.Object, technology);

            _mockRepository.Verify(m => m.SaveAsync(It.IsAny<Technology>()));
            mockQueue.Verify(m => m.PublishAsync("history", It.IsAny<string>()), Times.Never());
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetTechnologyByIdShouldReturnNoContent()
        {
            var id = "";
            _mockRepository.Setup(m => m.FindByIdAsync(id, null)).ReturnsAsync((Technology) null);

            var result = await _controller.GetTechnologyById(_mockRepository.Object, id);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetTechnologyByIdShouldReturnATechnology()
        {
            var technology = new Technology("C#", "c#", "Languages and Frameworks", "", "");
            var id = "";
            _mockRepository.Setup(m => m.FindByIdAsync(id, null)).ReturnsAsync(technology);

            var result = await _controller.GetTechnologyById(_mockRepository.Object, id) as OkObjectResult;
            var value = result.Value;

            Assert.IsType<Technology>(value);
        }

        [Fact]
        public async Task GetAllTechnologiesShouldReturnNoContent()
        {
            var technologyList = new List<Technology>();
            _mockRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(technologyList);
            _mockEntityRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(new List<Entity>() {});
            var technologyService = new TechnologyService();

            var result = await _controller.GetAllTechnologies(_mockRepository.Object, _mockEntityRepository.Object, technologyService);

            Assert.IsAssignableFrom<NoContentResult>(result);
        }

        [Fact]
        public async Task GetAllTechnologiesShouldReturnAllTechnologies()
        {
            var technologyList = new List<Technology>()
            {
                new Technology("C", "c", "Languages and Frameworks", "", ""),
                new Technology("C#", "c#", "Languages and Frameworks", "", ""),
                new Technology("C++", "c++", "Languages and Frameworks", "", "")
            };
            technologyList[0].Id = "5c73c15a8b89521e44e98805";
            technologyList[1].Id = "5c73c15a8b89521e44e98807";
            var entityList = new List<Entity>()
            {
                new Entity()
                {
                    Name = "1", Id = "5c73c15a8b89521e44e98804", Technologies = new EntityTechnology[]
                    {
                        new EntityTechnology("5c73c15a8b89521e44e98805", "Status", new EntityTechnologyUrl[0]),
                    }
                },
                new Entity()
                {
                    Name = "1", Id = "5c73c15a8b89521e44e98806", Technologies = new EntityTechnology[]
                    {
                        new EntityTechnology("5c73c15a8b89521e44e98807", "Status", new EntityTechnologyUrl[0]),
                    }
                },
                new Entity()
                {
                    Name = "1", Id = "5c73c15a8b89521e44e98808", Technologies = new EntityTechnology[0]
                },
            };
            _mockRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(technologyList);
            _mockEntityRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(entityList);
            var technologyService = new TechnologyService();

            var result = await _controller.GetAllTechnologies(_mockRepository.Object, _mockEntityRepository.Object, technologyService)
                as OkObjectResult;
            var value = result.Value;

            Assert.IsAssignableFrom<IEnumerable<Technology>>(value);
        }

        [Fact]
        public async Task GetTechnologiesNotInEntityShouldReturnTechnologies()
        {

            var technologyList = new List<Technology>()
            {
                new Technology("C", "c", "Languages and Frameworks", "", ""),
                new Technology("C#", "c#", "Languages and Frameworks", "", ""),
                new Technology("C++", "c++", "Languages and Frameworks", "", "")
            };
            technologyList[0].Id = "5c73c15a8b89521e44e98805";
            technologyList[1].Id = "5c73c15a8b89521e44e98807";
            _mockRepository.Setup(m => m.FindTechnologiesNotInEntity(_mockEntityRepository.Object, It.IsAny<string>()))
                .ReturnsAsync(technologyList);

            var result = 
                await _controller.GetTechnologiesNotInEntity(_mockRepository.Object, _mockEntityRepository.Object, "id") as OkObjectResult;
            var value = result.Value;

            Assert.IsAssignableFrom<IEnumerable<Technology>>(value);
        }

        [Fact]
        public async Task PatchTechnologyShouldReturnNoContentResult()
        {
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "root"),
                        new Claim(ClaimTypes.Name, "")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var technology = new Technology("C++", "c++", "Languages and Frameworks", "", "");
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(technology);
            _mockRepository.Setup(m => m.ReplaceOneAsync(It.IsAny<string>(), It.IsAny<Technology>(), null))
                .ReturnsAsync(new Mock<ReplaceOneResult>().Object);
            JsonPatchDocument<Technology> patch = new JsonPatchDocument<Technology>(
                new List<Operation<Technology>>( 
                    new Operation<Technology>[] { new Operation<Technology>("replace", "/name", "", "c") }
                ), 
                new DefaultContractResolver()
            );

            var result = await _controller.PatchTechnology(_mockRepository.Object, mockQueue.Object, "id", patch);
            Assert.IsAssignableFrom<NoContentResult>(result);
            mockQueue.Verify(m => m.PublishAsync("history", It.IsAny<string>()));
        }
    }
}
