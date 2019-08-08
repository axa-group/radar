using Moq;
using RadarTechno.Users;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using RadarTechno.Entities;
using Xunit;

namespace RadarTechno.tests.Users
{
    public class UserControllerTest
    {
        private Mock<IUserRepository> _mockRepository;
        private Mock<IEntityRepository> _mockEntityRepository;
        private Mock<IUserService> _mockService;
        private UserController _controller;

        public UserControllerTest()
        {
            _mockRepository = new Mock<IUserRepository>();
            _mockEntityRepository = new Mock<IEntityRepository>();
            _mockService = new Mock<IUserService>();
            var appSettings = new AppSettings() { Secret = "mh3J3VCNoGxfjoTowmxDY0mYThJJ9c3x" };
            IOptions<AppSettings> options = Options.Create(appSettings);
            _controller = new UserController(options);
        }

        [Fact]
        public async Task GetUserShouldReturnAUser()
        {
            var entityList = new string[] { "entity"};
            var user = new User("nom", "mail", entityList, "user");
            _mockRepository.Setup(m => m.FindByIdAsync("", null)).ReturnsAsync(user);

            var result = await _controller.GetUserById(_mockRepository.Object, "") as OkObjectResult;
            var value = result.Value;
            Assert.IsType<User>(value);
        }

        [Fact]
        public async Task GetAllUsersShouldReturnNoContent()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "root"),
                        new Claim(ClaimTypes.Name, "")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var userList = new List<User>();
            var mockEntityRepository = new Mock<IEntityRepository>();
            mockEntityRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(new Entity());
            _mockRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(userList);

            var result = await _controller.GetAllUsers(_mockRepository.Object, mockEntityRepository.Object);
            Assert.IsAssignableFrom<NoContentResult>(result);
        }

        [Fact]
        public async Task GetAllUsersShouldReturnAllUsers()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "root"),
                        new Claim(ClaimTypes.Name, "")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var entityList = new string[] { "entity" };
            var user = new User("nom", "mail", entityList, "user");
            var user2 = new User("nom", "mail", entityList, "user");
            var userList = new List<User>() { user, user2 };
            var mockEntityRepository = new Mock<IEntityRepository>();
            mockEntityRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(new Entity());
            _mockRepository.Setup(m => m.FindAllAsync()).ReturnsAsync(userList);

            var result = await _controller.GetAllUsers(_mockRepository.Object, mockEntityRepository.Object) as OkObjectResult;
            var value = result.Value;
            Assert.IsAssignableFrom<IEnumerable<User>>(value);
        }

        [Fact]
        public async Task GetAllUsersShouldReturnEntityUsers()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var entityList = new string[] { "entity" };
            var user = new User("nom", "mail", entityList, "user");
            var user2 = new User("nom", "mail", entityList, "user");
            var userList = new List<User>() { user, user2 };
            var mockEntityRepository = new Mock<IEntityRepository>();
            mockEntityRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(new Entity());
            _mockRepository.Setup(m => m.FindEntityUsers(It.IsAny<string>(), null)).ReturnsAsync(userList);

            var result = await _controller.GetAllUsers(_mockRepository.Object, mockEntityRepository.Object) as OkObjectResult;
            var value = result.Value;
            Assert.IsAssignableFrom<IEnumerable<User>>(value);
        }

        [Fact]
        public async Task RegisterShouldReturnCreatedAtAction()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var userDto = new RegisterUser("name", "mail@axa.fr", "passeword", "entity", "user");
            var user = new User("nom", "mail@axa.fr", new string[] { "entity" }, "user");
            _mockService.Setup(m => m.Create(userDto)).ReturnsAsync(user);
            var result = await _controller.Register(_mockService.Object, userDto);

            Assert.IsType<CreatedAtActionResult>(result);
        }

        [Fact]
        public async Task RegisterWithInvalidEmailShouldReturnBadRequest()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var userDto = new RegisterUser("name", "mail", "passe", "entity", "user");
            var user = new User("nom", "mail", new string[] { "entity" }, "user");
            _mockService.Setup(m => m.Create(userDto)).ReturnsAsync(user);
            var result = await _controller.Register(_mockService.Object, userDto);

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task RegisterWithExistingEmailShouldReturnBadRequest()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var userDto = new RegisterUser("name", "mail@axa.fr", "passeword", "entity", "user");
            var user = new User("nom", "mail@axa.fr", new string[] { "entity" }, "user");
            _mockService.Setup(m => m.Create(userDto)).ThrowsAsync(
                new UserException("Username \"" + userDto.Email + "\" is already taken")
            );
            var result = await _controller.Register(_mockService.Object, userDto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task RegisterShouldReturnUnauthorized()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var userDto = new RegisterUser("name", "email", "passe", "entity", "user");
            var result = await _controller.Register(_mockService.Object, userDto);

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task PatchUserShouldReplaceAndReturnsNoContent()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var jsonPatch = new JsonPatchDocument<User>();
            jsonPatch.Replace(u => u.Name, "new name");
            var user = new User("name", "mail@axa.fr", new string[] { "entity" }, "user");
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(user);
            jsonPatch.ApplyTo(user);

            var result = await _controller.PatchUser(_mockRepository.Object, _mockEntityRepository.Object, "id", jsonPatch);

            _mockRepository.Verify(m => m.ReplaceOneAsync("id", user, null));
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PatchUserShouldAddToAdminListAndReplaceAndReturnsNoContent()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "root"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var jsonPatch = new JsonPatchDocument<User>();
            jsonPatch.Replace(u => u.Role, "admin");
            var user = new User("name", "mail@axa.fr", new string[] { "entity" }, "user");
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(user);

            var result = await _controller.PatchUser(_mockRepository.Object, _mockEntityRepository.Object, "id", jsonPatch);

            jsonPatch.ApplyTo(user);
            _mockRepository.Verify(m => m.ReplaceOneAsync("id", user, null));
            _mockEntityRepository.Verify(m => m.AddAdminToAdminList(user.Email, "entity"));
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PatchUserShouldRemoveFromAdminListAndReplaceAndReturnsNoContent()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var jsonPatch = new JsonPatchDocument<User>();
            jsonPatch.Replace(u => u.Role, "user");
            var user = new User("name", "mail@axa.fr", new string[] { "entity" }, "admin");
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(user);

            var result = await _controller.PatchUser(_mockRepository.Object, _mockEntityRepository.Object, "id", jsonPatch);

            jsonPatch.ApplyTo(user);
            _mockRepository.Verify(m => m.ReplaceOneAsync("id", user, null));
            _mockEntityRepository.Verify(m => m.RemoveAdminFromAdminList(user.Email, "entity"));
            Assert.IsType<NoContentResult>(result);
        }
        [Fact]
        public async Task PatchUserFromUserShouldReturnUnauthorized()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "user"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var jsonPatch = new JsonPatchDocument<User>();
            var user = new User("name", "mail@axa.fr", new string[] { "entity" }, "admin");
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(user);

            var result = await _controller.PatchUser(_mockRepository.Object, _mockEntityRepository.Object, "id", jsonPatch);

            Assert.IsType<UnauthorizedResult>(result);
        }


        [Fact]
        public async Task PatchUserFromAdminWithDifferentEntityReturnsUnauthorized()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity 2")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var jsonPatch = new JsonPatchDocument<User>();
            jsonPatch.Replace(u => u.Name, "new name");
            var user = new User("name", "mail@axa.fr", new string[] { "entity" }, "user");
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(user);
            var result = await _controller.PatchUser(_mockRepository.Object, _mockEntityRepository.Object, "id", jsonPatch);
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task PatchUserWithInvalidMailShouldReturnBadRequest()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "admin"),
                        new Claim(ClaimTypes.Name, ""),
                        new Claim(ClaimTypes.PrimaryGroupSid, "entity")
                    })),
                }
            };
            _controller.ControllerContext = context;
            var jsonPatch = new JsonPatchDocument<User>();
            jsonPatch.Replace(u => u.Email, "mail");
            var user = new User("name", "mail@axa.fr", new string[] { "entity" }, "user");
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(user);
            var result = await _controller.PatchUser(_mockRepository.Object, _mockEntityRepository.Object, "id", jsonPatch);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task AuthenticateReturnsBadRequestResult()
        {
            _mockService.Setup(m => m.Authenticate(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((User) null);

            var result = await _controller.Authenticate(_mockEntityRepository.Object, _mockService.Object,
                new AuthUser());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task AuthenticateReturnsOkResult()
        {
            var authUser = new AuthUser() {Email = "email@axa.fr", Password = "pass"};
            var user = new User("Name", "email@axa.fr", new string[] { "entity" }, "user");
            _mockService.Setup(m => m.Authenticate(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(user);

            var result = await _controller.Authenticate(_mockEntityRepository.Object, _mockService.Object, authUser);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
