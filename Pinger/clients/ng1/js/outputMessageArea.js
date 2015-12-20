(function () {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.outputMessageArea = function () {

        var $outputArea;

        $(document).ready(function() {
            $outputArea = $("#outputArea");
        });

        function safe(fn) {
            if ($outputArea) {
                var remainingArgs = Array.prototype.slice.call(arguments, 1);
                fn.apply(null, remainingArgs);
            }
        }

        function log(message) {
            var existingContent = $outputArea.html();
            var separator = existingContent.length > 0 ? "\n" : "";
            $outputArea.html(existingContent + separator + message);
            $outputArea.scrollTop(1E10);
        }

        function clear() {
            $outputArea.empty();
        }

        return {
            log: _.partial(safe, log),
            clear: _.partial(safe, clear)
        };
    };
}());
