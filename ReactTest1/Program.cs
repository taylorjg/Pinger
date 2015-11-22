using System;
using ReactTest1.Hubs;

namespace ReactTest1
{
    internal static class Program
    {
        private static void Main()
        {
            const string url = "http://localhost:3344";
            var period = TimeSpan.FromSeconds(1);

            using (Startup.WebApp(url))
            using (TestHub.Timer(period))
            {
                Console.WriteLine($"Listening on {url}");
                Console.WriteLine("Press a key to quit...");
                Console.ReadKey();
            }
        }
    }
}
