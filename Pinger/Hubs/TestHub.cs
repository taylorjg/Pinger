using System;
using System.Threading;
using Microsoft.AspNet.SignalR;

// ReSharper disable ClassNeverInstantiated.Global
// ReSharper disable UnusedMember.Global

namespace Pinger.Hubs
{
    public class TestHub : Hub
    {
        public static IDisposable PingAllEverySecond()
        {
            var period = TimeSpan.FromSeconds(1);
            var n = 1;

            return InvokeClientMethodPeriodically(
                period,
                hubContext => hubContext.Clients.All,
                clients => clients.ping(n++));
        }

        private static IDisposable InvokeClientMethodPeriodically(
            TimeSpan period,
            Func<IHubContext, dynamic> clientsSelector,
            Action<dynamic> action)
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<TestHub>();
            TimerCallback callback = _ => action(clientsSelector(hubContext));
            const object state = null;
            var dueTime = TimeSpan.FromSeconds(0);
            return new Timer(callback, state, dueTime, period);
        }
    }
}
