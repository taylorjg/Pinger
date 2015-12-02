using System;
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

            app.MapSignalR();
        }

        public static IDisposable WebApp(string url)
        {
            return Microsoft.Owin.Hosting.WebApp.Start<Startup>(url);
        }
    }
}
