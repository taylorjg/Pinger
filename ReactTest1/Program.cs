using System;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Hosting;
using ReactTest1.Hubs;

namespace ReactTest1
{
    internal static class Program
    {
        private static void Main()
        {
            const string url = "http://localhost:3344";

            using (WebApp.Start<Startup>(url))
            {
                var n = 1;
                var testHubContext = GlobalHost.ConnectionManager.GetHubContext<TestHub>();
                var timer = new Timer(_ => testHubContext.Clients.All.ping(n++), null, 0, 1000);

                Console.WriteLine($"Listening on {url}");

                Console.WriteLine("Press a key to quit...");
                Console.ReadKey();

                timer.Dispose();
            }
        }
    }
}
