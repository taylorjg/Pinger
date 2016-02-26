using System.Runtime.InteropServices;
using System.Threading;

namespace Pinger
{
    internal static class CtrlC
    {
        private delegate bool HandlerRoutine(int ctrlType);

        [DllImport("Kernel32")]
        private static extern bool SetConsoleCtrlHandler(HandlerRoutine handler, bool add);

        private static readonly ManualResetEventSlim ExitEvent = new ManualResetEventSlim();

        public static void Wait()
        {
            // http://stackoverflow.com/questions/6783561/nullreferenceexception-with-no-stack-trace-when-hooking-setconsolectrlhandler
            HandlerRoutine consoleCtrlHandler = ConsoleCtrlHandler;
            SetConsoleCtrlHandler(consoleCtrlHandler, true);
            ExitEvent.Wait();
            SetConsoleCtrlHandler(null, false);
        }

        private static bool ConsoleCtrlHandler(int ctrltype)
        {
            if (ctrltype != 0 /* CTRL+C */) return false;
            ExitEvent.Set();
            return true;
        }
    }
}
