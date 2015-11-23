(function(_) {

    "use strict";

    var addMessage = function ($element, newline, message) {
        var existingContent = $element.html();
        var separator = existingContent.length > 0 ? newline : "";
        $element.html(existingContent + separator + message);
        $element.scrollTop(1E10);
    };

    var connectionStateToString = function (state) {
        var csValues = $.signalR.connectionState;
        switch (state) {
            case csValues.connecting: return "Connecting";
            case csValues.connected: return "Connected";
            case csValues.reconnecting: return "Reconnecting";
            case csValues.disconnected: return "Disconnected";
            default: return "?";
        }
    };

    var getConnectionStateFlags = function(connectionState) {
        var csValues = $.signalR.connectionState;
        return {
            isConnecting: connectionState === csValues.connecting,
            isConnected: connectionState === csValues.connected,
            isReconnecting: connectionState === csValues.reconnecting,
            isDisconnected: connectionState === csValues.disconnected,
            isUnknown: _(_.keys(csValues)).all(function(key) {
                return connectionState !== csValues[key];
            })
        };
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
        var addOutputMessage = _.partial(addMessage, $outputArea, "\n");

        var setConnectionState = function (connection, connectionState) {

            var flags = getConnectionStateFlags(connectionState);

            var enableConnectionButton = flags.isDisconnected || flags.isUnknown;
            var disableConnectionButton = !enableConnectionButton;
            var disableDisconnectionButton = enableConnectionButton;
            $btnConnect.prop("disabled", disableConnectionButton);
            $btnDisconnect.prop("disabled", disableDisconnectionButton);

            $connectionState.text(connectionStateToString(connectionState));
            $connectionState.toggleClass("connectionGood", flags.isConnected);
            $connectionState.toggleClass("connectionBad", flags.isDisconnected);
            $connectionState.toggleClass("connectionWobbly", flags.isConnecting || flags.isReconnecting);

            $transportDetails.toggle(flags.isConnected);
            if (flags.isConnected) {
                $transportName.text(connection.transport.name);
            }
        };

        var hubConnection = $.hubConnection();

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
            setConnectionState(hubConnection, states.newState);
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

        var hubProxy = hubConnection.createHubProxy("testHub");

        hubProxy.on("ping", function (n) {
            addAlertMessage("ping " + n);
        });

        setConnectionState(hubConnection);
    });
}(window._));
