using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Design;

namespace RadarTechno
{

    class Subscriber
    {
        public string Type { get; set; }
        public Func<string, string, Task<bool>> Callback { get; set; }
        
    }

    public class Queue : IQueue
    {
        private IList<Subscriber> subscribers = new List<Subscriber>();

        public void PublishAsync(string type, string message)
        {
            foreach (var subscriber in subscribers)
            {
                if (subscriber.Type == type)
                {
                    subscriber.Callback(type, message);
                }
            }
        }
        
        public void SubscribeAsync(string type, Func<string, string, Task<bool>> func)
        {
            Subscriber subscriber = new Subscriber()
            {
                Type = type,
                Callback = func,
            };
            subscribers.Add(subscriber);

        }

    }
}
