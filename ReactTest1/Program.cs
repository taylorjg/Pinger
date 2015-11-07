using System;
using Microsoft.Owin.Hosting;

namespace ReactTest1
{
    internal static class Program
    {
        private static void Main()
        {
            using (WebApp.Start<Startup>("http://localhost:3344"))
            {
                Console.WriteLine("Press a key to quit...");
                Console.ReadKey();
            }
        }
    }
}
