using CommandLine;

namespace Pinger
{
    internal class Options
    {
        // ReSharper disable UnusedAutoPropertyAccessor.Global

        [Option("no-ws", Required = false, DefaultValue = false, HelpText = "Remove WebSockets transport")]
        public bool NoWebSockets { get; set; }

        [Option("no-ff", Required = false, DefaultValue = false, HelpText = "Remove ForeverFrame transport")]
        public bool NoForeverFrame { get; set; }

        [Option("no-lp", Required = false, DefaultValue = false, HelpText = "Remove LongPolling transport")]
        public bool NoLongPolling { get; set; }

        [Option("no-sse", Required = false, DefaultValue = false, HelpText = "Remove ServerSentEvents transport")]
        public bool NoServerSentEvents { get; set; }
    }
}
