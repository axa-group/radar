using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RadarTechno.History
{
    [Route("api/history")]
    public class HistoryController : Controller
    {
        [HttpGet("{type}/{id}")]
        public async Task<IActionResult> GetHistory(
            string type, 
            string id,
            [FromServices] IHistoryRepository historyRepository)
        {
            var result = await historyRepository.FindByElementIdAsync(id, type);
            return Ok(result);
        }
    }
}
