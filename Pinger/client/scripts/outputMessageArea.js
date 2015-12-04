(function () {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.outputMessageArea = function () {

        var $outputArea;

        $(document).ready(function() {
            $outputArea = $("#outputArea");
        });

        var log = function (message) {
            if ($outputArea) {
                var existingContent = $outputArea.html();
                var separator = existingContent.length > 0 ? "\n" : "";
                $outputArea.html(existingContent + separator + message);
                $outputArea.scrollTop(1E10);
            }
        };

        var clear = function() {
            if ($outputArea) {
                $outputArea.empty();
            }
        };

        return {
            log: log,
            clear: clear
        };
    };
}());
