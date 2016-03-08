(function(_) {

    "use strict";

    window.pinger = window.pinger || {};

    window.pinger.backend = function (logOutputMessage) {

        logOutputMessage = logOutputMessage || _.noop;

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
            logOutputMessage("[starting]");
        });

        hubConnection.connectionSlow(function () {
            logOutputMessage("[connectionSlow]");
        });

        hubConnection.disconnected(function () {
            logOutputMessage("[disconnected]");
        });

        hubConnection.reconnecting(function () {
            logOutputMessage("[reconnecting]");
        });

        hubConnection.reconnected(function () {
            logOutputMessage("[reconnected]");
        });

        hubConnection.stateChanged(function (states) {
            var oldStateName = connectionStateToString(states.oldState);
            var newStateName = connectionStateToString(states.newState);
            logOutputMessage("[stateChanged] oldState: " + oldStateName + "; newState: " + newStateName);
        });

        hubConnection.error(function (errorData) {
            logOutputMessage("[error] errorData: " + errorData);
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
                    logOutputMessage("[start.done]");
                })
                .fail(function hubConnectionFail(reason) {
                    logOutputMessage("[start.fail] reason: " + reason);
                });
        };

        var stop = function() {
            hubConnection.stop();
        };

        var onStateChanged = function (cb) {
            cb = cb || _.noop;
            hubConnection.stateChanged(function(states) {
                var oldFlags = getConnectionStateFlags(states.oldState);
                var newFlags = getConnectionStateFlags(states.newState);
                var oldStateName = connectionStateToString(states.oldState);
                var newStateName = connectionStateToString(states.newState);
                var transportName = hubConnection.transport && hubConnection.transport.name ? hubConnection.transport.name : "";
                cb(oldStateName, oldFlags, newStateName, newFlags, transportName);
            });

            var initialFlags = getConnectionStateFlags(null);
            var initialStateName = connectionStateToString(null);
            var initialTransportName = "";
            cb(initialStateName, initialFlags, initialStateName, initialFlags, initialTransportName);
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
}(window._));
