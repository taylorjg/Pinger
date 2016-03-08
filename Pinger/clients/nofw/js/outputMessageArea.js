(function () {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.outputMessageArea = function () {

        var $scrollableMessageArea;

        $(document).ready(function () {
            var $outputArea = $("#outputArea");
            $scrollableMessageArea = $outputArea.find(".scrollableMessageArea");
            var $btnClear = $outputArea.find("button");
            $btnClear.click(function () {
                $scrollableMessageArea.empty();
            });
        });

        function log(message) {
            $scrollableMessageArea.append($("<div>", { html: message }));
            $scrollableMessageArea.scrollTop(1E10);
        }

        return {
            log: log
        };
    };
}());
