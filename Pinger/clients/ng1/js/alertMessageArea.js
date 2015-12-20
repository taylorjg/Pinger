(function () {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.alertMessageArea = function () {

        var $alertArea;

        $(document).ready(function() {
            $alertArea = $("#alertArea");
        });

        function safe(fn) {
            if ($alertArea) {
                var remainingArgs = Array.prototype.slice.call(arguments, 1);
                fn.apply(null, remainingArgs);
            }
        }

        function log(message) {
            var existingContent = $alertArea.html();
            var separator = existingContent.length > 0 ? "<br />" : "";
            $alertArea.html(existingContent + separator + message);
            $alertArea.scrollTop(1E10);
        }

        function clear() {
            $alertArea.empty();
        }

        return {
            log: _.partial(safe, log),
            clear: _.partial(safe, clear)
        };
    };
}());
