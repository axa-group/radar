using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RadarTechno.Configuration;
using Xunit;

namespace RadarTechno.tests.Configuration
{
    public class ConfigurationControllerTests
    {
        private ConfigurationController _controller;

        public ConfigurationControllerTests()
        {
            _controller = new ConfigurationController();
        }

        [Fact]
        public async Task GetConfigurationReturnsOkResult()
        {
            var result = _controller.GetConfiguration();
            Assert.IsType<OkObjectResult>(result);
        }
    }
}
