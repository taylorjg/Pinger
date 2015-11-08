using Microsoft.AspNet.SignalR;

// ReSharper disable ClassNeverInstantiated.Global
// ReSharper disable UnusedMember.Global

namespace ReactTest1.Hubs
{
    public class TestHub : Hub
    {
        public void Ping(int n)
        {
            Clients.All.ping(n);
        }
    }
}
