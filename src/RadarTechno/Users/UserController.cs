using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RadarTechno.Entities;

namespace RadarTechno.Users
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly Validation _validation = new Validation();

        public UserController(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromServices] IUserRepository userRepository, string id)
        {
            var result = await userRepository.FindByIdAsync(id);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers(
            [FromServices] IUserRepository userRepository,
            [FromServices] IEntityRepository entityRepository)
        {
            var currentUser = HttpContext.User;
            if (!currentUser.IsInRole("root") && !currentUser.IsInRole("admin"))
            {
                return Unauthorized();
            }

            List<User> result;
            if (currentUser.IsInRole("admin"))
            {
                result = (List<User>) await userRepository.FindEntityUsers(
                    currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimaryGroupSid).Value);
            }
            else
            {
                result = (List<User>) await userRepository.FindAllAsync();
            }
            if (result.Any())
            {
                foreach (var res in result)
                {
                    res.Entity = await entityRepository.FindByIdAsync(res.EntityList[0]);
                }
                return Ok(result);
            }
            return NoContent();
        }
        
        [AllowAnonymous]
        [HttpPost("auth")]
        public async Task<IActionResult> Authenticate(
            [FromServices] IEntityRepository entityRepository, 
            [FromServices] IUserService userService,
            [FromBody] AuthUser authUser)
        {
            var user = await userService.Authenticate(authUser.Email, authUser.Password);

            if (user == null)
            {
                return BadRequest(new {message = "Username or password is incorrect"});
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.PrimaryGroupSid, user.EntityList[0]), 
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var entity = await entityRepository.FindByIdAsync(user.EntityList[0]);

            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                Entity = entity,
                Role=user.Role,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register([FromServices] IUserService userService, [FromBody]RegisterUser registerUser)
        {
            try
            {
                var currentUser = HttpContext.User;
                var userEntity = currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimaryGroupSid).Value;
                if (!currentUser.IsInRole("root") && !currentUser.IsInRole("admin") 
                    || (currentUser.IsInRole("admin") && registerUser.EntityList[0] != userEntity))
                {
                    return Unauthorized();
                }
                if (!_validation.Validate(registerUser))
                {
                    return BadRequest();
                }
                var user = await userService.Create(registerUser);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (UserException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("token-validation")]
        public async Task<IActionResult> Validate(
            [FromHeader(Name = "Authorization")] string authorizationHeader,
            [FromServices] IEntityRepository entityRepository)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.Secret)),
                ValidateLifetime = true
            };
            SecurityToken securityToken;
            var accessToken = authorizationHeader.Split(' ')[1];
            var tokenHandler = new JwtSecurityTokenHandler();
            var validatedToken = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out securityToken);
            if (validatedToken == null)
            {
                return BadRequest(new {message = "Invalid Token"});
            }

            var claims = validatedToken.Claims;

            var entity = await entityRepository.FindByIdAsync(claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimaryGroupSid).Value);

            return Ok(new
            {
                Id = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value,
                Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email).Value,
                Entity= entity,
                Role = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role).Value,
                Token = accessToken
            });
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchUser(
            [FromServices]IUserRepository userRepository, 
            [FromServices]IEntityRepository entityRepository,
            string id,
            [FromBody]JsonPatchDocument<User> userPatch)
        {
            var currentUser = HttpContext.User;
            var userEntity = currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimaryGroupSid).Value;
            var user = await userRepository.FindByIdAsync(id);
            if (user == null)
            {
                return BadRequest();
            }
            if (!currentUser.IsInRole("root") && !currentUser.IsInRole("admin") 
                || (currentUser.IsInRole("admin") && userEntity != user.EntityList[0]))
            {
                return Unauthorized();
            }
            var oldRole = user.Role;
            userPatch.ApplyTo(user);
            if (!_validation.Validate(user))
            {
                return BadRequest();
            }
            if (oldRole != user.Role)
            {
                if (user.Role == "admin")
                {
                    await entityRepository.AddAdminToAdminList(user.Email, user.EntityList[0]);
                }
                if (oldRole == "admin")
                {
                    await entityRepository.RemoveAdminFromAdminList(user.Email, user.EntityList[0]);
                }
            }
            await userRepository.ReplaceOneAsync(id, user);
            return NoContent();
        }
    }
}