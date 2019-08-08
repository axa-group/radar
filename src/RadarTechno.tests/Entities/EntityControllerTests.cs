using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Moq;
using RadarTechno.Entities;
using RadarTechno.Technologies;
using RadarTechno.Users;
using Xunit;

namespace RadarTechno.tests.Entities
{
    public class EntityControllerTests
    {
        private Mock<IEntityRepository> _mockRepository;
        private Mock<ITechnologyRepository> _mockTechnologyRepository;
        private Mock<IUserService> _mockUserService;
        private EntityController _controller;

        public EntityControllerTests()
        {
            _mockRepository = new Mock<IEntityRepository>();
            _mockTechnologyRepository = new Mock<ITechnologyRepository>();
            _mockUserService = new Mock<IUserService>();
            var mockConfiguration = new Mock<IConfiguration>();
            var mockConfigurationSection = new Mock<IConfigurationSection>();
            mockConfigurationSection.SetupGet(m => m.Value).Returns("referenceId");
            mockConfiguration.Setup(x => x.GetSection("ReferenceEntityId")).Returns(mockConfigurationSection.Object);
            _controller = new EntityController(mockConfiguration.Object);
        }

        [Fact]
        public async Task GetEntityByIdReturnsOkObjectResult()
        {
            var entity = new Entity();
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(entity);

            var result = await _controller.GetEntityById(_mockRepository.Object, "id");

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetEntityByIdReturnsNoContent()
        {
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync((Entity) null);

            var result = await _controller.GetEntityById(_mockRepository.Object, "id");

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetAllEntitiesByIdReturnsOkObjectResult()
        {
            var entity = new Entity();
            var entityList = new List<Entity>() {entity};
            _mockRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(entityList);

            var result = await _controller.GetAllEntities(_mockRepository.Object);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetAllEntitiesByIdReturnsNoContent()
        {
            _mockRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(new List<Entity>() {});

            var result = await _controller.GetAllEntities(_mockRepository.Object);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetEntityTechnologiesByIdWithoutGroupTechnologiesReturnsOkObjectResult()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var entityTechnologyList = new List<EntityTechnology>() { entityTechnology };
            var entityService = new EntityService();
            _mockRepository.Setup(m => m.FindTechnologies(_mockTechnologyRepository.Object, "id"))
                .ReturnsAsync(entityTechnologyList);
            _mockRepository.Setup(m => m.FindTechnologies(_mockTechnologyRepository.Object, "referenceId"))
                .ReturnsAsync(new List<EntityTechnology>());

            var result = await _controller.GetEntityTechnologies(
                _mockRepository.Object, _mockTechnologyRepository.Object, entityService, "id");

            Assert.IsType<OkObjectResult>(result);
        }
  
        [Fact]
        public async Task GetEntityTechnologiesByIdReturnsOkObjectResult()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var entityTechnologyList = new List<EntityTechnology>() { entityTechnology };
            var entityService = new EntityService();
            _mockRepository.Setup(m => m.FindTechnologies(_mockTechnologyRepository.Object, "id"))
                .ReturnsAsync(entityTechnologyList);
            _mockRepository.Setup(m => m.FindTechnologies(_mockTechnologyRepository.Object, "referenceId"))
                .ReturnsAsync(entityTechnologyList);

            var result = await _controller.GetEntityTechnologies(
                _mockRepository.Object, _mockTechnologyRepository.Object, entityService, "id");

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetEntityTechnologiesByIdReturnsNoContent()
        {
            var entityService = new EntityService();
            _mockRepository.Setup(m => m.FindTechnologies(_mockTechnologyRepository.Object, "id"))
                .ReturnsAsync(new List<EntityTechnology>() {});

            var result = await _controller.GetEntityTechnologies(
                _mockRepository.Object, _mockTechnologyRepository.Object, entityService, "id");

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task CreateEntityReturnsUnauthorized()
        {

            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "user"),
                        new Claim(ClaimTypes.Name, "")
                    })),
                }
            };
            _controller.ControllerContext = context;

            var result = await _controller.CreateEntity(_mockRepository.Object, new Entity());

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task CreateEntityReturnsCreatedAt()
        {
            var entity = new Entity() { Name = "Name", WorkflowUrl = "http://www.url.com" };
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

            var result = await _controller.CreateEntity(_mockRepository.Object, entity);

            _mockRepository.Verify(m => m.SaveAsync(entity));
            Assert.IsType<CreatedAtActionResult>(result);
        }

        [Fact]
        public async Task CreateEntityWithoutNameReturnsBadRequest()
        {
            var entity = new Entity() { WorkflowUrl = "http://www.url.com" };
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

            var result = await _controller.CreateEntity(_mockRepository.Object, entity);

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task CreateEntityWithInvalidWorkflowUrlReturnsBadRequest()
        {
            var entity = new Entity() { WorkflowUrl = "Url" };
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

            var result = await _controller.CreateEntity(_mockRepository.Object, entity);
            
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PatchEntityReturnsUnauthorized()
        {

            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "user"),
                        new Claim(ClaimTypes.Name, "")
                    })),
                }
            };
            _controller.ControllerContext = context;

            var result = await _controller.PatchEntity(_mockRepository.Object, _mockUserService.Object,
                "id", new JsonPatchDocument<Entity>());

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task PatchEntityReturnsBadRequest()
        {

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
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync((Entity) null);

            var result = await _controller.PatchEntity(_mockRepository.Object, _mockUserService.Object,
                "id", new JsonPatchDocument<Entity>());

            Assert.IsType<BadRequestResult>(result);
        }


        [Fact]
        public async Task PatchEntityCallsReplaceOneAndReturnsNoContent()
        {
            var entity = new Entity() {Name = "name"};
            var jsonPatch = new JsonPatchDocument<Entity>();
            jsonPatch.Replace(e => e.Name, "new name");
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
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(entity);
            jsonPatch.ApplyTo(entity);

            var result = await _controller.PatchEntity(_mockRepository.Object, _mockUserService.Object,
                "id", jsonPatch);

            _mockRepository.Verify(m => m.ReplaceOneAsync("id", entity, null));
            Assert.IsType<NoContentResult>(result);
        }


        [Fact]
        public async Task PatchEntityCallsUserServiceAndReplaceOneAndReturnsNoContent()
        {
            var entity = new Entity() { Name = "name", AdminList = new string[] {"admin1", "admin2"}};
            var jsonPatch = new JsonPatchDocument<Entity>();
            jsonPatch.Replace(e => e.AdminList, new string[] { "admin1", "admin3" });
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
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(entity);

            var result = await _controller.PatchEntity(_mockRepository.Object, _mockUserService.Object,
                "id", jsonPatch);

            _mockRepository.Verify(m => m.ReplaceOneAsync("id", entity, null));
            _mockUserService.Verify(m => m.HandleNewAdminsRoles(
                new string[] { "admin1", "admin2" }, 
                new string[] { "admin1", "admin3" },
                It.IsAny<string>()
            ));
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateTechnologyStatusReturnsUnauthorized()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "2"), 
                    })),
                }
            };
            _controller.ControllerContext = context;

            var result = await _controller.UpdateTechnologyStatus(_mockRepository.Object, mockQueue.Object, "1", entityTechnology);

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task UpdateTechnologyStatusCallsReplaceOneReturnsNoContent()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var newEntityTechnologyUrl = new EntityTechnologyUrl() { Label = "label", Url = "url" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var entity = new Entity() { Technologies = new EntityTechnology[] { entityTechnology } };
            var patchedEntityTechnology = new EntityTechnology("id", "new status", new EntityTechnologyUrl[] { newEntityTechnologyUrl });
            var updatedEntityTechnology = entityTechnology;
            updatedEntityTechnology.UpdateEntityTechnology(patchedEntityTechnology);
            var replaceOneResult = new ReplaceOneResult.Acknowledged(1, 1, null);
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "1"),
                    })),
                }
            };
            _controller.ControllerContext = context;
            _mockRepository.Setup(m => m.FindTechnologyByIdAsync(It.IsAny<string>(), It.IsAny<string>(), null))
                .ReturnsAsync(entityTechnology);
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(entity);

            var result = await _controller.UpdateTechnologyStatus(_mockRepository.Object, mockQueue.Object, "1", patchedEntityTechnology);

            _mockRepository.Verify(m => m.UpdateEntityTechnology("1", updatedEntityTechnology));
            mockQueue.Verify(m => m.PublishAsync("history", It.IsAny<string>()));
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateTechnologyStatusWithoutStatusReturnsBadRequestResult()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var newEntityTechnologyUrl = new EntityTechnologyUrl() { Label = "label", Url = "url" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var entity = new Entity() { Technologies = new EntityTechnology[] { entityTechnology } };
            var patchedEntityTechnology = new EntityTechnology("id", null, new EntityTechnologyUrl[] { newEntityTechnologyUrl });
            var updatedEntityTechnology = entityTechnology;
            updatedEntityTechnology.UpdateEntityTechnology(patchedEntityTechnology);
            var replaceOneResult = new ReplaceOneResult.Acknowledged(1, 1, null);
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "1"),
                    })),
                }
            };
            _controller.ControllerContext = context;
            _mockRepository.Setup(m => m.FindTechnologyByIdAsync(It.IsAny<string>(), It.IsAny<string>(), null))
                .ReturnsAsync(entityTechnology);
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(entity);

            var result = await _controller.UpdateTechnologyStatus(_mockRepository.Object, mockQueue.Object, "1", patchedEntityTechnology);
            
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task AddTechnologyReturnsBadRequest()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var entity = new Entity() { Technologies = new EntityTechnology[] { entityTechnology } };
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "1"),
                    })),
                }
            };
            _controller.ControllerContext = context;
            _mockRepository.Setup(m => m.AddTechnology(It.IsAny<EntityTechnology>(), It.IsAny<string>(), _mockTechnologyRepository.Object))
                .ThrowsAsync(new ArgumentException());

            var result = await _controller.AddTechnology(_mockRepository.Object, mockQueue.Object, _mockTechnologyRepository.Object,
                entityTechnology, "");

            Assert.IsType<BadRequestObjectResult>(result);
        }


        [Fact]
        public async Task AddTechnologyReturnsNoContent()
        {
            var entityTechnologyUrl = new EntityTechnologyUrl() { Label = "", Url = "" };
            var entityTechnology = new EntityTechnology("id", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var newEntityTechnology = new EntityTechnology("id2", "status", new EntityTechnologyUrl[] { entityTechnologyUrl });
            var updateResult = new UpdateResult.Acknowledged(1, 1, null);
            var entity = new Entity() { Technologies = new EntityTechnology[] { entityTechnology } };
            var mockQueue = new Mock<IQueue>();
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "1"),
                    })),
                }
            };
            _controller.ControllerContext = context;
            _mockRepository.Setup(m => m.AddTechnology(It.IsAny<EntityTechnology>(), "id", _mockTechnologyRepository.Object))
                .ReturnsAsync(updateResult);

            var result = await _controller.AddTechnology(_mockRepository.Object, mockQueue.Object, _mockTechnologyRepository.Object,
                entityTechnology, "1");

            mockQueue.Verify(m => m.PublishAsync("history", It.IsAny<string>()));
            Assert.IsType<NoContentResult>(result);
        }
    }
}
