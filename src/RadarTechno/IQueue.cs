using System;
using System.Threading.Tasks;

namespace RadarTechno
{
    public interface IQueue
    {
        void PublishAsync(string type, string message);
        void SubscribeAsync(string type, Func<string, string, Task<bool>> func);
    }
}