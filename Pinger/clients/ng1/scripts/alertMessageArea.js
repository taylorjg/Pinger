(function () {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.alertMessageArea = function () {

        var $alertArea;

        $(document).ready(function() {
            $alertArea = $("#alertArea");
        });

        var log = function (message) {
            if ($alertArea) {
                var existingContent = $alertArea.html();
                var separator = existingContent.length > 0 ? "<br />" : "";
                $alertArea.html(existingContent + separator + message);
                $alertArea.scrollTop(1E10);
            }
        };

        var clear = function() {
            if ($alertArea) {
                $alertArea.empty();
            }
        };

        return {
            log: log,
            clear: clear
        };
    };
}());
