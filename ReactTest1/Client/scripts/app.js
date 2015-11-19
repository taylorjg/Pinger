﻿(function(_) {

    "use strict";

    var addMessage = function ($element, newline, message) {
        var existingContent = $element.html();
        var separator = existingContent.length > 0 ? newline : "";
        $element.html(existingContent + separator + message);
        $element.scrollTop(1E10);
    };

    $(document).ready(function () {

        var $btnConnect = $("#btnConnect");
        var $btnDisconnect = $("#btnDisconnect");
        var $btnClear = $("#btnClear");
        var $alertArea = $("#alertArea");
        var $outputArea = $("#outputArea");

        var addAlertMessage = _.partial(addMessage, $alertArea, "<br />");
        var addOutputMessage = _.partial(addMessage, $outputArea, "\n");

        var hubConnection = $.hubConnection();
        var hubProxy = hubConnection.createHubProxy("testHub");

        hubProxy.on("ping", function (n) {
            addAlertMessage("ping " + n);
        });

        var setConnectionStatus = function (isConnected) {
            $btnConnect.prop("disabled", isConnected);
            $btnDisconnect.prop("disabled", !isConnected);
        };

        $btnConnect.click(function () {
            addOutputMessage("Calling hubConnection.start()");
            hubConnection.start()
                .done(function () {
                    addOutputMessage("hubConnection.start() succeeded");
                    setConnectionStatus(true);
                })
                .fail(function (reason) {
                    addOutputMessage("hubConnection.start() failed - reason: " + reason);
                    setConnectionStatus(false);
                });
        });

        $btnDisconnect.click(function() {
            addOutputMessage("Calling hubConnection.stop()");
            hubConnection.stop();
            setConnectionStatus(false);
        });

        $btnClear.click(function() {
            $alertArea.html("");
            $outputArea.html("");
        });

        setConnectionStatus(false);
    });
}(window._));
