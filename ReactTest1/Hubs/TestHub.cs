using System;
using System.Threading;
using Microsoft.AspNet.SignalR;

// ReSharper disable ClassNeverInstantiated.Global
// ReSharper disable UnusedMember.Global

namespace ReactTest1.Hubs
{
    public class TestHub : Hub
    {
        public static IDisposable Timer(TimeSpan period)
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
