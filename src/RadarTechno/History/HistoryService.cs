using JsonDiffPatchDotNet;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using RadarTechno.Entities;
using RadarTechno.Technologies;
using RadarTechno.Users;

namespace RadarTechno.History
{
    public class HistoryService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly Validation _validation = new Validation();

        public HistoryService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task<bool> Callback(string type, string message)
        {
            if (type == "history")
            {
                HistoryMessage historyMessage = JsonConvert.DeserializeObject<HistoryMessage>(message);
                await AddHistory(historyMessage);
                return true;
            }
            return false;
        }

        public async Task AddHistory(HistoryMessage historyMessage)
        {
            _ = Task.Run(async () =>
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var serviceProvider = scope.ServiceProvider;
                    var historyRepository = (IHistoryRepository)serviceProvider.GetService(typeof(IHistoryRepository));
                    var userService = (IUserService)serviceProvider.GetService(typeof(IUserService));
                    await AddHistoryToRepository(historyMessage, historyRepository, userService);
                }
            });
        }

        public async Task AddHistoryToRepository(HistoryMessage historyMessage, IHistoryRepository historyRepository,
            IUserService userService)
        {
            var authorUser = await userService.GetById(historyMessage.Author);
            var output = await GetDiff(
                historyRepository, historyMessage.Type, historyMessage.Id, historyMessage.Data);
            if(output != null) {
                var history = new History(authorUser.Email, historyMessage.Type, historyMessage.Id, output);
                if (_validation.Validate(history))
                {
                    await historyRepository.SaveAsync(history);
                }
            }
        }

        public async Task<string> GetDiff(
            IHistoryRepository historyRepository, string type, string id, string data)
        {
            var historyList = await historyRepository.FindByElementIdAsync(id, type);
            historyList = historyList.Reverse();
            var jdp = new JsonDiffPatch();
            string patch = @"{}";
            foreach (var history in historyList)
            {
                patch = jdp.Patch(patch, history.Diff);
            }
            var output = jdp.Diff(patch, data);
            return output;
        }

    }
}
