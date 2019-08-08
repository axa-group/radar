using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RadarTechno.History;
using Xunit;

namespace RadarTechno.tests.History
{
    public class HistoryControllerTests
    {
        private Mock<IHistoryRepository> _mockRepository;
        private HistoryController _controller;

        public HistoryControllerTests()
        {
            _mockRepository = new Mock<IHistoryRepository>();
            _controller = new HistoryController();
        }

        [Fact]
        public async Task GetHistoryReturnsOkResult()
        {
            var historyList = new List<RadarTechno.History.History>();
            _mockRepository.Setup(m =>
                    m.FindByElementIdAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), null))
                .ReturnsAsync(historyList);

            var result = await _controller.GetHistory("type", "id", _mockRepository.Object);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
