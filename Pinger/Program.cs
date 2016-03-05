using System;
using CommandLine;
using Pinger.Hubs;

namespace Pinger
{
    internal static class Program
    {
        public static Options Options { get; private set; }

        private static void Main(string[] args)
        {
            const string url = "http://localhost:3344";

            Options = new Options();
            Parser.Default.ParseArgumentsStrict(args, Options);

            using (Startup.WebApp(url))
            using (TestHub.PingAllEverySecond())
            {
                Console.WriteLine($"Listening on {url}");
                Console.WriteLine("Press CTRL+C to exit...");
                CtrlC.Wait();
            }
        }
    }
}
