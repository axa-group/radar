using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json;
using RadarTechno.Entities;
using RadarTechno.History;

namespace RadarTechno.Technologies
{
    [Authorize]
    [Route("api/technologies")]
    [ApiController]
    public class TechnologyController : Controller
    {
        readonly IConfiguration configuration;
        private readonly Validation _validation = new Validation();

        public TechnologyController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTechnologyById([FromServices]ITechnologyRepository technologyRepository, string id)
        {
            var result = await technologyRepository.FindByIdAsync(id);
            if (result != null)
            {
                return Ok(result);
            }
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTechnologies(
            [FromServices] ITechnologyRepository technologyRepository,
            [FromServices] IEntityRepository entityRepository,
            [FromServices] ITechnologyService technologyService
        )
        {
            var result = await technologyRepository.FindAllAsync();
            if (result.Any())
            {
                var entities = await entityRepository.FindAllAsync();
                var technologiesToReturn = new List<Technology>();
                var referenceEntityId = configuration.GetSection("ReferenceEntityId");
                foreach (var technology in result)
                {
                    var technologyToAdd = new Technology(technology)
                    {
                        EntitiesStatus = new List<EntityStatus>()
                    };
                    foreach (var entity in entities)
                    {
                        technologyToAdd = technologyService.SetEntityStatus(technologyToAdd, entity, referenceEntityId.Value);
                    }
                    technologiesToReturn.Add(technologyToAdd);
                }
                return Ok(technologiesToReturn);
            }
            return NoContent();
        }

        [HttpGet("not-in-entity/{entityId}")]
        public async Task<ActionResult> GetTechnologiesNotInEntity(
            [FromServices] ITechnologyRepository technologyRepository,
            [FromServices] IEntityRepository entityRepository,
            string entityId)
        {
            var technologies = await technologyRepository.FindTechnologiesNotInEntity(entityRepository, entityId);
            return Ok(technologies);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchTechnology(
            [FromServices] ITechnologyRepository technologyRepository,
            [FromServices] IQueue queue,
            string id, 
            [FromBody]JsonPatchDocument<Technology> technologyPatch)
        {
            var user = HttpContext.User;
            if (!user.IsInRole("root"))
            {
                return Unauthorized();
            }
            var technology = await technologyRepository.FindByIdAsync(id);
            if (technology == null)
            {
                return BadRequest();
            }
            technologyPatch.ApplyTo(technology);
            if (!_validation.Validate(technology))
            {
                return BadRequest();
            }
            await technologyRepository.ReplaceOneAsync(id, technology);

            var author = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;
            queue.PublishAsync("history", JsonConvert.SerializeObject(
                new HistoryMessage(){Id = id, Data = JsonConvert.SerializeObject(technology), Type = "technology", Author = author}
            ));
            return NoContent();
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateTechnology(
            [FromServices] ITechnologyRepository technologyRepository,
            [FromServices] IQueue queue,
            Technology technology)
        {
            var user = HttpContext.User;
            if (!user.IsInRole("root"))
            {
                return Unauthorized();
            }
            if (!_validation.Validate(technology))
            {
                return BadRequest();
            }
            try
            {
                await technologyRepository.SaveAsync(technology);

                var author = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;
                queue.PublishAsync("history", JsonConvert.SerializeObject(
                    new HistoryMessage() { Id = technology.Id, Data = JsonConvert.SerializeObject(technology), Type = "technology", Author = author }
                ));
                return CreatedAtAction(nameof(GetTechnologyById), new {id = technology.Id}, technology);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (MongoWriteException exception)
            {
                if(exception.WriteError.Category == ServerErrorCategory.DuplicateKey)
                {
                    return Conflict(new {message = $"Duplicate entry for technology {technology.Name}"});
                }

                return BadRequest();
            }
        }
    }
}
