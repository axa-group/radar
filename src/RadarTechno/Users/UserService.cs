using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace RadarTechno.Users
{
    
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private const int MaxHashLength = 64;
        private const int MaxSaltLength = 128;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public static string Base64Encode(byte[] plainTextBytes) {
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static byte[] Base64Decode(string base64EncodedData) {
            return System.Convert.FromBase64String(base64EncodedData);
        }


        public async Task<User> GetById(string id)
        {
            return await _userRepository.FindByIdAsync(id);
        }

        public async Task<User> Authenticate(string email, string password)
        {
            var user = await _userRepository.FindOneByEmailAsync(email);
            if (user == null ||
                string.IsNullOrEmpty(email) ||
                string.IsNullOrEmpty(password) ||
                !VerifyPasswordHash(password, Base64Decode(user.PasswordHash), Base64Decode(user.PasswordSalt))
            )
            {
                return null;
            }

            return user;
        }

        public async Task<User> Create(RegisterUser registerUser)
        {
            if (string.IsNullOrWhiteSpace(registerUser.Password))
            {
                throw new UserException("Password is required");
            }
            
            var duplicate = await _userRepository.FindOneByEmailAsync(registerUser.Email);

            if (duplicate != null)
            {
                throw new UserException("Username \"" + registerUser.Email + "\" is already taken");
            }
            
            var passwordHashResult = CreatePasswordHash(registerUser.Password);

            var createdUser = new User(registerUser)
            {
                PasswordHash = passwordHashResult.PasswordHash, 
                PasswordSalt = passwordHashResult.PasswordSalt
            };

            await _userRepository.SaveAsync(createdUser);
            return createdUser;
        }

        public async Task HandleNewAdminsRoles(string[] oldAdminList, string[] newAdminList, string entityId)
        {
            if (oldAdminList != null && newAdminList != null)
            {
                var adminsToPromote = oldAdminList.Any() ?
                    newAdminList.Except(oldAdminList) : newAdminList;
                foreach (var newAdmin in adminsToPromote)
                {
                    await _userRepository.PromoteToEntityAdmin(newAdmin, entityId);
                }

                var adminsToDemote = newAdminList.Any() ?
                    oldAdminList.Except(newAdminList) : oldAdminList;
                foreach (var oldAdmin in adminsToDemote)
                {
                    await _userRepository.DemoteToUser(oldAdmin, entityId);
                }
            }
        }

        private static PasswordHashResult CreatePasswordHash(string password)
        {
            var passwordHashResult = new PasswordHashResult();
            if (String.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            }
            // Not an AXA standard 
            using (var hmac = new HMACSHA512())
            {
                passwordHashResult.PasswordSalt = Base64Encode(hmac.Key);
                passwordHashResult.PasswordHash = Base64Encode(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            }

            return passwordHashResult;
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (String.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            }
            if (storedHash.Length != MaxHashLength)
            {
                throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            }
            if (storedSalt.Length != MaxSaltLength)
            {
                throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");
            }

            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (var i = 0; i < computedHash.Length; i++)
                    if (computedHash[i] != storedHash[i])
                    {
                        return false;
                    }
            }
            return true;
        }
    }
    
    public class PasswordHashResult  {
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
    }
}