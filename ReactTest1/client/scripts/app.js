(function(_) {

    "use strict";

    var addMessage = function ($element, newline, message) {
        var existingContent = $element.html();
        var separator = existingContent.length > 0 ? newline : "";
        $element.html(existingContent + separator + message);
        $element.scrollTop(1E10);
    };

    var connectionStateToString = function (state) {
        var convert = function() {
            switch (state) {
                case $.signalR.connectionState.connecting: return "connecting";
                case $.signalR.connectionState.connected: return "connected";
                case $.signalR.connectionState.reconnecting: return "reconnecting";
                case $.signalR.connectionState.disconnected: return "disconnected";
                default: return "?";
            }
        };
        return _.capitalize(convert());
    };

    $(document).ready(function () {

        var $connectionState = $("#connectionState");
        var $btnConnect = $("#btnConnect");
        var $btnDisconnect = $("#btnDisconnect");
        var $btnClear = $("#btnClear");
        var $alertArea = $("#alertArea");
        var $outputArea = $("#outputArea");

        var addAlertMessage = _.partial(addMessage, $alertArea, "<br />");
        var addOutputMessage = _.partial(addMessage, $outputArea, "\n");

        var setConnectionState = function (connectionState) {

            var isConnecting = (connectionState === $.signalR.connectionState.connecting);
            var isConnected = (connectionState === $.signalR.connectionState.connected);
            var isReconnecting = (connectionState === $.signalR.connectionState.reconnecting);
            var isDisconnected = (connectionState === $.signalR.connectionState.disconnected);

            $btnConnect.prop("disabled", isConnected || isConnecting || isReconnecting);
            $btnDisconnect.prop("disabled", isDisconnected);

            $connectionState.text(connectionStateToString(connectionState));
            $connectionState.toggleClass("connectionGood", isConnected);
            $connectionState.toggleClass("connectionBad", isDisconnected);
            $connectionState.toggleClass("connectionWobbly", isConnecting || isReconnecting);
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

        // TODO: I would prefer to access the current state of hubConnection (or hubProxy?) instead.
        setConnectionState($.signalR.connectionState.disconnected);
    });
}(window._));
