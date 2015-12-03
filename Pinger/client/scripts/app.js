(function(_) {

    "use strict";

    var addMessage = function ($element, newline, message) {
        var existingContent = $element.html();
        var separator = existingContent.length > 0 ? newline : "";
        $element.html(existingContent + separator + message);
        $element.scrollTop(1E10);
    };

    $(document).ready(function () {

        var $connectionState = $("#connectionState");
        var $transportDetails = $("#transportDetails");
        var $transportName = $("#transportName");
        var $btnConnect = $("#btnConnect");
        var $btnDisconnect = $("#btnDisconnect");
        var $btnClear = $("#btnClear");
        var $alertArea = $("#alertArea");
        var $outputArea = $("#outputArea");

        var addAlertMessage = _.partial(addMessage, $alertArea, "<br />");
        // var addOutputMessage = _.partial(addMessage, $outputArea, "\n");

        var handleStateChanged = function (oldStateName, oldFlags, newStateName, newFlags, transportName) {

            var enableConnectionButton = newFlags.isDisconnected || newFlags.isUnknown;
            var disableConnectionButton = !enableConnectionButton;
            var disableDisconnectionButton = enableConnectionButton;

            $btnConnect.prop("disabled", disableConnectionButton);
            $btnDisconnect.prop("disabled", disableDisconnectionButton);

            $connectionState.text(newStateName);
            $connectionState.toggleClass("connectionGood", newFlags.isConnected);
            $connectionState.toggleClass("connectionBad", newFlags.isDisconnected);
            $connectionState.toggleClass("connectionWobbly", newFlags.isConnecting || newFlags.isReconnecting);

            $transportDetails.toggle(newFlags.isConnected);
            $transportName.text(transportName);
        };

        var backend = window.pinger.backend();
        backend.onStateChanged(handleStateChanged);

        $btnConnect.click(function () {
            backend.start();
        });

        $btnDisconnect.click(function() {
            backend.stop();
        });

        $btnClear.click(function() {
            $alertArea.html("");
            $outputArea.html("");
        });

        backend.onMethod("testHub", "ping", function (n) {
            addAlertMessage("ping " + n);
        });
    });
}(window._));
