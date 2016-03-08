(function () {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.alertMessageArea = function () {

        var $scrollableMessageArea;

        $(document).ready(function () {
            var $alertArea = $("#alertArea");
            $scrollableMessageArea = $alertArea.find(".scrollableMessageArea");
            var $btnClear = $alertArea.find("button");
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
