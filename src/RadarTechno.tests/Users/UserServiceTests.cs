using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Moq;
using RadarTechno.Users;
using Xunit;

namespace RadarTechno.tests.Users
{
    public class UserServiceTests
    {
        public UserServiceTests()
        {
            _mockRepository = new Mock<IUserRepository>();
        }

        private readonly Mock<IUserRepository> _mockRepository;

        
        [Fact]
        public async Task GetByIdShouldReturnAUser1()
        {
            string youhou = "kIPCgx1d5RrLUFpkRV/4d885dMBXCJc+hgXNgrKNfT62K8p0FyfLC9bY6b9F2KNYA8dyMmMAgGCqMSLScvuKpg==";
            var result =UserService.Base64Decode(youhou);
            Assert.Equal(result.Length, 60);
        }
        
        
        [Fact]
        public async Task GetByIdShouldReturnAUser()
        {
            var userDto = new RegisterUser("name", "email", "passe", "entity", "user");
            var user = new User(userDto);
            _mockRepository.Setup(m => m.FindByIdAsync(It.IsAny<string>(), null)).ReturnsAsync(user);
            var userService = new UserService(_mockRepository.Object);

            var result = await userService.GetById("id");
            Assert.Equal(user, result);
        }

        [Fact]
        public async Task AuthenticateWithNullEmailShouldReturnNull()
        {
            var userDto = new RegisterUser("name", null, "passe", "entity", "user");

            var result = await new UserService(_mockRepository.Object).Authenticate(userDto.Email, userDto.Password);

            Assert.Null(result);
        }

        [Fact]
        public async Task AuthenticateWithoutCorrespondingUserShouldReturnNull()
        {
            var userDto = new RegisterUser("name", "email", "passe", "entity", "user");
            _mockRepository.Setup(m => m.FindOneByEmailAsync(It.IsAny<string>(), null))
                .ReturnsAsync((User) null);

            var result = await new UserService(_mockRepository.Object).Authenticate(userDto.Email, userDto.Password);

            Assert.Null(result);
        }

        [Fact]
        public async Task AuthenticateWithWrongPasswordShouldReturnAUser()
        {
            var userDto = new RegisterUser("name", "email", "passe", "entity", "user");
            byte[] passwordHash, passwordSalt;
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("other pass"));
            }

            var createdUser = new User(userDto);
            createdUser.PasswordHash =  passwordHash;
            createdUser.PasswordSalt = passwordSalt;
            _mockRepository.Setup(m => m.FindOneByEmailAsync(It.IsAny<string>(), null))
                .ReturnsAsync(createdUser);
            var result = await new UserService(_mockRepository.Object).Authenticate(userDto.Email, userDto.Password);

            Assert.Null(result);
        }

        [Fact]
        public async Task AuthenticateShouldReturnAUser()
        {
            var userService = new UserService(_mockRepository.Object);
            var userDto = new RegisterUser("name", "email", "passe", "entity", "user");
            var user = new User(userDto);
            byte[] passwordHash, passwordSalt;
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password));
            }

            var createdUser = new User(userDto);
            createdUser.PasswordHash = passwordHash;
            createdUser.PasswordSalt = passwordSalt;
            _mockRepository.Setup(m => m.FindOneByEmailAsync(It.IsAny<string>(), null))
                .ReturnsAsync(createdUser);
            var result = await new UserService(_mockRepository.Object).Authenticate(userDto.Email, userDto.Password);

            Assert.IsType<User>(result);
        }

        [Fact]
        public async Task CreateUserShouldWithNullPasswordThrowUserException()
        {
            _mockRepository.Setup(m => m.FindOneByEmailAsync(It.IsAny<string>(), null)).ReturnsAsync((User)null);
            var userDto = new RegisterUser("name", "email", null, "entity", "user");

            Task act() => new UserService(_mockRepository.Object).Create(userDto);

            await Assert.ThrowsAsync<UserException>(act);
        }

        [Fact]
        public async Task CreateUserShouldWithDuplicateEmailEntryThrowUserException()
        {
            var userDto = new RegisterUser("name", "email", "passe", "entity", "user");
            _mockRepository.Setup(m => m.FindOneByEmailAsync(It.IsAny<string>(), null)).ReturnsAsync(new User(userDto));

            Task act() => new UserService(_mockRepository.Object).Create(userDto);

            await Assert.ThrowsAsync<UserException>(act);
        }

        [Fact]
        public async Task CreateUserShouldReturnAUser()
        {
            _mockRepository.Setup(m => m.FindOneByEmailAsync(It.IsAny<string>(), null)).ReturnsAsync((User) null);
            var userDto = new RegisterUser("name", "email", "passe", "entity", "user");

            await new UserService(_mockRepository.Object).Create(userDto);

            _mockRepository.Verify(m => m.SaveAsync(It.IsAny<User>()));
        }

        [Fact]
        public async Task HandleNewAdminsRolesUpdatesUserRoles()
        {
            var oldAdminList = new string[] {"admin1", "admin2", "admin3"};
            var newAdminList = new string[] { "admin1", "admin4", "admin5" };

            await new UserService(_mockRepository.Object).HandleNewAdminsRoles(oldAdminList, newAdminList, "id");

            _mockRepository.Verify(m => m.PromoteToEntityAdmin("admin4", "id"));
            _mockRepository.Verify(m => m.PromoteToEntityAdmin("admin5", "id"));
            _mockRepository.Verify(m => m.DemoteToUser("admin2", "id"));
            _mockRepository.Verify(m => m.DemoteToUser("admin3", "id"));
        }

        [Fact]
        public async Task HandleNewAdminsRolesWithEmpyArraysDoesNothing()
        {
            var oldAdminList = new string[0];
            var newAdminList = new string[0];

            await new UserService(_mockRepository.Object).HandleNewAdminsRoles(oldAdminList, newAdminList, "id");

            _mockRepository.Verify(m => m.PromoteToEntityAdmin(It.IsAny<string>(), It.IsAny<string>()), Times.Never());
            _mockRepository.Verify(m => m.DemoteToUser(It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }
    }
}