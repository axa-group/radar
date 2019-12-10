using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json;
using RadarTechno.History;
using RadarTechno.Technologies;
using RadarTechno.Users;

namespace RadarTechno.Entities
{   
    [Authorize]
    [Route("api/entities")]
    [ApiController]
    public class EntityController : Controller
    {
        readonly IConfiguration configuration;
        private readonly Validation _validation = new Validation();

        public EntityController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEntityById([FromServices] IEntityRepository entityRepository, string id)
        {
            var result = await entityRepository.FindByIdAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEntities([FromServices] IEntityRepository entityRepository)
        {
            var result = await entityRepository.FindAllAsync();
            if (result.Any())
            {
                return Ok(result);
            }
            return NoContent();
        }

        [HttpGet("{id}/technologies")]
        public async Task<IActionResult> GetEntityTechnologies(
            [FromServices] IEntityRepository entityRepository, 
            [FromServices] ITechnologyRepository technologyRepository,
            [FromServices] IEntityService entityService,
            string id)
        {
            var result = await entityRepository.FindTechnologies(technologyRepository, id);
            if (result != null && result.Any())
            {
                var referenceEntityId = configuration.GetSection("ReferenceEntityId");
                if (referenceEntityId != null && !String.IsNullOrEmpty(referenceEntityId.Value))
                {
                    var referenceEntityTechnologies =
                        await entityRepository.FindTechnologies(technologyRepository, referenceEntityId.Value);
                    if (referenceEntityTechnologies != null && referenceEntityTechnologies.Any())
                    {
                        result = entityService.PopulateEntityTechnologiesGroupStatus(result,
                            referenceEntityTechnologies);
                    }
                }
                return Ok(result);
            }
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreateEntity([FromServices] IEntityRepository entityRepository, Entity entity)
        {
            var user = HttpContext.User;
            if (!user.IsInRole("root"))
            {
                return Unauthorized();
            }
            if(!_validation.Validate(entity))
            {
                return BadRequest();
            }
            await entityRepository.SaveAsync(entity);
            return CreatedAtAction(nameof(GetEntityById), new { id = entity.Id }, entity);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchEntity(
            [FromServices] IEntityRepository entityRepository,
            [FromServices] IUserService userService,
            string id,
            [FromBody]JsonPatchDocument<Entity> entityPatch)
        {
            var user = HttpContext.User;
            if (!user.IsInRole("root")) return Unauthorized();
            var entity = await entityRepository.FindByIdAsync(id);
            if (entity == null) return BadRequest();
            try
            {
                var oldAdmins = entity.AdminList;
                entityPatch.ApplyTo(entity);
                if (!_validation.Validate(entity))
                {
                    return BadRequest();
                }
                var adminsPatch = entityPatch.Operations.Where(o => o.path.Equals("/adminList") || o.path.Equals("/AdminList"));
                if (adminsPatch.Any())
                {
                    await userService.HandleNewAdminsRoles(oldAdmins, entity.AdminList, entity.Id);
                }
                await entityRepository.ReplaceOneAsync(id, entity);
            }
            catch (UserException ex)
            {
                return BadRequest(new {message = ex.Message});
            }
            return NoContent();
        }

        [HttpPatch("{id}/technology-status")]
        public async Task<IActionResult> UpdateTechnologyStatus(
            [FromServices] IEntityRepository entityRepository,
            [FromServices] IQueue queue,
            string id, 
            [FromBody] EntityTechnology patchEntityTechnology)
        {
            var user = HttpContext.User;
            var claims = user.Claims;
            var userEntity = claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimaryGroupSid).Value;
            var author = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;
            if ((user.IsInRole("admin") && userEntity != id) && !user.IsInRole("root"))
            {
                return Unauthorized();
            }
            var entityTechnology =
                await entityRepository.FindTechnologyByIdAsync(id, patchEntityTechnology.TechnologyId);
            if (!_validation.Validate(entityTechnology))
            {
                return BadRequest();
            }
            entityTechnology.UpdateEntityTechnology(patchEntityTechnology);
            var result = await entityRepository.UpdateEntityTechnology(id, entityTechnology);
            queue.PublishAsync("history", JsonConvert.SerializeObject(
                new HistoryMessage()
                {
                    Id = entityTechnology.Id,
                    Data = JsonConvert.SerializeObject(
                        entityTechnology,
                        new JsonSerializerSettings
                        {
                            NullValueHandling = NullValueHandling.Ignore
                        }
                    ),
                    Type = "entity-technology",
                    Author = author
                }, 
                new JsonSerializerSettings {NullValueHandling = NullValueHandling.Ignore }
            ));
            return NoContent();
        }

        [HttpPatch("{id}/technologies")]
        public async Task<IActionResult> AddTechnology(
            [FromServices] IEntityRepository entityRepository,
            [FromServices] IQueue queue,
            [FromServices] ITechnologyRepository technologyRepository,
            [FromBody] EntityTechnology entityTechnology,
            string id)
        {
            try
            {
                var user = HttpContext.User;
                if (!_validation.Validate(entityTechnology))
                {
                    return BadRequest();
                }
                await entityRepository.AddTechnology(entityTechnology, id, technologyRepository);
                var author = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;
                queue.PublishAsync("history", JsonConvert.SerializeObject(
                    new HistoryMessage()
                    {
                        Id = entityTechnology.Id,
                        Data = JsonConvert.SerializeObject(
                            entityTechnology,
                            new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore
                            }
                        ),
                        Type = "entity-technology",
                        Author = author
                    }
                ));
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (MongoWriteException exception)
            {
                if (exception.WriteError.Category == ServerErrorCategory.DuplicateKey)
                {
                    return Conflict(new { message = "This technology is already in your entity" });
                }
                return BadRequest();
            }
        }
    }
}