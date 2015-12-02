using System;
using Pinger.Hubs;

namespace Pinger
{
    internal static class Program
    {
        private static void Main()
        {
            const string url = "http://localhost:3344";

            using (Startup.WebApp(url))
            using (TestHub.PingAllEverySecond())
            {
                Console.WriteLine($"Listening on {url}");
                Console.WriteLine("Press a key to quit...");
                Console.ReadKey();
            }
        }
    }
}
