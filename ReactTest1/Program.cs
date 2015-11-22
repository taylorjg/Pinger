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
            var period = TimeSpan.FromSeconds(1);

            using (WebApp(url))
            using (Timer(period))
            {
                Console.WriteLine($"Listening on {url}");
                Console.WriteLine("Press a key to quit...");
                Console.ReadKey();
            }
        }

        private static IDisposable WebApp(string url)
        {
            return Microsoft.Owin.Hosting.WebApp.Start<Startup>(url);
        }

        private static IDisposable Timer(TimeSpan period)
        {
            var testHubContext = GlobalHost.ConnectionManager.GetHubContext<TestHub>();
            var n = 1;
            TimerCallback callback = _ => testHubContext.Clients.All.ping(n++);
            const object state = null;
            var dueTime = TimeSpan.FromSeconds(0);
            return new Timer(callback, state, dueTime, period);
        }
    }
}
