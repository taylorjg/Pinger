using System;
using ReactTest1.Hubs;

namespace ReactTest1
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
