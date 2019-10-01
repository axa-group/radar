using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RadarTechno.History
{
    [Route("api/configuration")]
    public class ConfigurationController : Controller
    {
        [HttpGet("")]
        public IActionResult GetConfiguration()
        {
            var assemblyVersion = typeof(ConfigurationController).Assembly.GetName().Version.ToString();
            var configuration = new { version = assemblyVersion };
            return Ok(configuration);
        }
    }
}
