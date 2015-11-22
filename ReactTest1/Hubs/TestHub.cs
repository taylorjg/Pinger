using System;
using System.Threading;
using Microsoft.AspNet.SignalR;

// ReSharper disable ClassNeverInstantiated.Global
// ReSharper disable UnusedMember.Global

namespace ReactTest1.Hubs
{
    public class TestHub : Hub
    {
        public static IDisposable PingEverySecond()
        {
            var testHubContext = GlobalHost.ConnectionManager.GetHubContext<TestHub>();
            var n = 1;
            return InvokeActionEverySecond(() => testHubContext.Clients.All.ping(n++));
        }

        private static IDisposable InvokeActionEverySecond(Action action)
        {
            TimerCallback callback = _ => action();
            const object state = null;
            var dueTime = TimeSpan.FromSeconds(0);
            var period = TimeSpan.FromSeconds(1);
            return new Timer(callback, state, dueTime, period);
        }
    }
}
