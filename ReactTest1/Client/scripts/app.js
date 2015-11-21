(function(_) {

    "use strict";

    var addMessage = function ($element, newline, message) {
        var existingContent = $element.html();
        var separator = existingContent.length > 0 ? newline : "";
        $element.html(existingContent + separator + message);
        $element.scrollTop(1E10);
    };

    var connectionStateToString = function(state) {
        switch (state) {
            case $.signalR.connectionState.connecting: return "connecting";
            case $.signalR.connectionState.connected: return "connected";
            case $.signalR.connectionState.reconnecting: return "reconnecting";
            case $.signalR.connectionState.disconnected: return "disconnected";
            default: return "?";
        }
    };

    $(document).ready(function () {

        var $btnConnect = $("#btnConnect");
        var $btnDisconnect = $("#btnDisconnect");
        var $btnClear = $("#btnClear");
        var $alertArea = $("#alertArea");
        var $outputArea = $("#outputArea");
        var $connectionState = $("#connectionState");

        var addAlertMessage = _.partial(addMessage, $alertArea, "<br />");
        var addOutputMessage = _.partial(addMessage, $outputArea, "\n");

        var setConnectionState = function (connectionState) {
            $connectionState.text(connectionStateToString(connectionState));
            var isConnected = (connectionState === $.signalR.connectionState.connected);
            $btnConnect.prop("disabled", isConnected);
            $btnDisconnect.prop("disabled", !isConnected);
        };

        var hubConnection = $.hubConnection();
        var hubProxy = hubConnection.createHubProxy("testHub");

        hubProxy.on("ping", function (n) {
            addAlertMessage("ping " + n);
        });

        hubConnection.connectionSlow(function () {
            addOutputMessage("[connectionSlow]");
        });

        hubConnection.disconnected(function () {
            addOutputMessage("[disconnected]");
        });

        hubConnection.error(function (errorData) {
            addOutputMessage("[error] errorData: " + errorData);
        });

        hubConnection.reconnected(function () {
            addOutputMessage("[reconnected]");
        });

        hubConnection.reconnecting(function () {
            addOutputMessage("[reconnecting]");
        });

        hubConnection.stateChanged(function (states) {
            setConnectionState(states.newState);
            var oldState = connectionStateToString(states.oldState);
            var newState = connectionStateToString(states.newState);
            addOutputMessage("[stateChanged] oldState: " + oldState + "; newState: " + newState);
        });

        hubConnection.starting(function () {
            addOutputMessage("[starting]");
        });

        $btnConnect.click(function () {
            addOutputMessage("Calling hubConnection.start()");
            hubConnection.start()
                .done(function () {
                    addOutputMessage("hubConnection.start() succeeded");
                })
                .fail(function (reason) {
                    addOutputMessage("hubConnection.start() failed - reason: " + reason);
                });
        });

        $btnDisconnect.click(function() {
            addOutputMessage("Calling hubConnection.stop()");
            hubConnection.stop();
        });

        $btnClear.click(function() {
            $alertArea.html("");
            $outputArea.html("");
        });

        setConnectionState();
    });
}(window._));
