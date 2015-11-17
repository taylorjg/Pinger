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
            app.UseStaticFiles(new StaticFileOptions
            {
                FileSystem = new PhysicalFileSystem(@".\dist")
            });

            app.MapSignalR();

            // app.UseWebApi(new HttpConfiguration());
        }
    }
}
