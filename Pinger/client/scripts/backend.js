(function() {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.backend = function () {

        var hubConnection = $.hubConnection();
        var hubProxies = {};

        var connectionStateToString = function (state) {
            var cs = $.signalR.connectionState;
            switch (state) {
                case cs.connecting: return "Connecting";
                case cs.connected: return "Connected";
                case cs.reconnecting: return "Reconnecting";
                case cs.disconnected: return "Disconnected";
                default: return "?";
            }
        };

        var connectionStateValues = _.values($.signalR.connectionState);

        var getConnectionStateFlags = function(connectionState) {
            var cs = $.signalR.connectionState;
            return {
                isConnecting: connectionState === cs.connecting,
                isConnected: connectionState === cs.connected,
                isReconnecting: connectionState === cs.reconnecting,
                isDisconnected: connectionState === cs.disconnected,
                isUnknown: !_(connectionStateValues).contains(connectionState)
            };
        };

        hubConnection.starting(function () {
            // addOutputMessage("[starting]");
        });

        hubConnection.connectionSlow(function () {
            // addOutputMessage("[connectionSlow]");
        });

        hubConnection.disconnected(function () {
            // addOutputMessage("[disconnected]");
        });

        hubConnection.reconnecting(function () {
            // addOutputMessage("[reconnecting]");
        });

        hubConnection.reconnected(function () {
            // addOutputMessage("[reconnected]");
        });

        hubConnection.stateChanged(function (/* states */) {
            // setConnectionState(hubConnection, states.newState);
            // var oldState = connectionStateToString(states.oldState);
            // var newState = connectionStateToString(states.newState);
            // addOutputMessage("[stateChanged] oldState: " + oldState + "; newState: " + newState);
        });

        hubConnection.error(function (/* errorData */) {
            // addOutputMessage("[error] errorData: " + errorData);
        });

        var getHubProxy = function (hubName) {
            var hubProxy = hubProxies[hubName];
            if (!hubProxy) {
                hubProxy = hubProxies[hubName] = hubConnection.createHubProxy(hubName);
            }
            return hubProxy;
        };

        var start = function () {
            hubConnection.start()
                .done(function hubConnectionDone() {
                    // addOutputMessage("hubConnection.start() succeeded");
                })
                .fail(function hubConnectionFail() {
                    // addOutputMessage("hubConnection.start() failed - reason: " + reason);
                });
        };

        var stop = function() {
            hubConnection.stop();
        };

        var onStateChanged = function (cb) {
            cb = cb || function() {};
            hubConnection.stateChanged(function(states) {
                var oldFlags = getConnectionStateFlags(states.oldState);
                var newFlags = getConnectionStateFlags(states.newState);
                var oldStateName = connectionStateToString(states.oldState);
                var newStateName = connectionStateToString(states.newState);
                var transportName = newFlags.isConnected ? hubConnection.transport.name : "";
                cb(oldStateName, oldFlags, newStateName, newFlags, transportName);
            });
        };

        var onMethod = function (hubName, methodName, cb, context) {
            var hubProxy = getHubProxy(hubName);
            hubProxy.on(methodName, function() {
                var thisArg = context || null;
                cb.apply(thisArg, arguments);
            });
        };

        return {
            start: start,
            stop: stop,
            onStateChanged: onStateChanged,
            onMethod: onMethod
        };
    };
}());
