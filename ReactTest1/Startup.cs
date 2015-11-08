using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;

[assembly: OwinStartup(typeof(ReactTest1.Startup))]

namespace ReactTest1
{
    internal class Startup
    {
        // ReSharper disable once UnusedMember.Global
        public void Configuration(IAppBuilder app)
        {
            // Configure the serving of static files.
            app.UseStaticFiles(new StaticFileOptions
            {
                FileSystem = new PhysicalFileSystem(@".\Client")
            });

            // Configure ASP.NET SignalR.
            app.MapHubs(new HubConfiguration
            {
                EnableDetailedErrors = true,
                EnableJavaScriptProxies = true
            });

            // Configure ASP.NET Web API 2.
            app.UseWebApi(new HttpConfiguration
            // ReSharper disable once RedundantEmptyObjectOrCollectionInitializer
            {
                // TODO: add configuration...
            });
        }
    }
}
