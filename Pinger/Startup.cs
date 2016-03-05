using System;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Transports;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
using Pinger;

[assembly: OwinStartup(typeof(Startup))]

namespace Pinger
{
    internal class Startup
    {
        // ReSharper disable once UnusedMember.Global
        public void Configuration(IAppBuilder app)
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                FileSystem = new PhysicalFileSystem(@".\dist")
            });

            RemoveTransports(GlobalHost.DependencyResolver);

            app.MapSignalR();
        }

        public static IDisposable WebApp(string url)
        {
            return Microsoft.Owin.Hosting.WebApp.Start<Startup>(url);
        }

        private static void RemoveTransports(IDependencyResolver resolver)
        {
            var transportManager = resolver.Resolve<ITransportManager>() as TransportManager;
            if (transportManager == null) return;

            if (Program.Options.NoWebSockets) transportManager.Remove("webSockets");
            if (Program.Options.NoForeverFrame) transportManager.Remove("foreverFrame");
            if (Program.Options.NoLongPolling) transportManager.Remove("longPolling");
            if (Program.Options.NoServerSentEvents) transportManager.Remove("serverSentEvents");
        }
    }
}
