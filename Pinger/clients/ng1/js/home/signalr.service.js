(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .service("signalr", signalr);

    signalr.$inject = ["$filter"];

    function signalr($filter) {

        var hubConnection = $.hubConnection();
        var hubProxies = {};
        var registeredClientMethodListeners = [];
        var registeredStateChangedListeners = [];
        var registeredLogListeners = [];
        var connectionStateToString = $filter("connectionStateToString");

        function start() {
            hubConnection.start()
                .done(function hubConnectionDone() {
                    invokeLogListeners("[start.done]");
                })
                .fail(function hubConnectionFail(reason) {
                    invokeLogListeners("[start.fail]", "reason:", reason);
                });
        }

        function stop() {
            hubConnection.stop();
        }

        function registerClientMethodListener(hubName, methodName, scope, cb, context) {

            registeredClientMethodListeners.push({
                hubName: hubName,
                methodName: methodName,
                scope: scope,
                cb: cb,
                context: context
            });

            var hubProxy = getHubProxy(hubName);

            // TODO: should only set this up once per hubName/methodName combination.
            hubProxy.on(methodName, function () {
                var args = arguments;
                registeredClientMethodListeners
                    .filter(function(item) {
                        return item.hubName === hubName && item.methodName === methodName;
                    })
                    .forEach(function(item) {
                        var scope = item.scope;
                        var cb = item.cb;
                        var context = item.context || null;
                        safeApply(scope, function () {
                            cb.apply(context, args);
                        });
                    });
            });
        }

        function registerStateChangedListener(scope, cb, context) {
            registeredStateChangedListeners.push({
                scope: scope,
                cb: cb,
                context: context
            });
        }

        function registerLogListener(scope, cb, context) {
            registeredLogListeners.push({
                scope: scope,
                cb: cb,
                context: context
            });
        }

        hubConnection.starting(function () {
            invokeLogListeners("[starting]");
        });

        hubConnection.connectionSlow(function () {
            invokeLogListeners("[connectionSlow]");
        });

        hubConnection.disconnected(function () {
            invokeLogListeners("[disconnected]");
        });

        hubConnection.reconnecting(function () {
            invokeLogListeners("[reconnecting]");
        });

        hubConnection.reconnected(function () {
            invokeLogListeners("[reconnected]");
        });

        hubConnection.stateChanged(function (states) {

            var oldStateName = connectionStateToString(states.oldState);
            var newStateName = connectionStateToString(states.newState);
            invokeLogListeners("[stateChanged]", "oldState:", oldStateName, "newState:", newStateName);

            var newStateFlags = getConnectionStateFlags(states.newState);
            var transportName = newStateFlags.isConnected ? hubConnection.transport.name : "";
            invokeStateChangedListeners(states.newState, newStateFlags, transportName);
        });

        hubConnection.error(function (errorData) {
            invokeLogListeners("[error]", "errorData:", errorData);
        });

        function getHubProxy(hubName) {
            var hubProxy = hubProxies[hubName];
            if (!hubProxy) {
                hubProxy = hubProxies[hubName] = hubConnection.createHubProxy(hubName);
            }
            return hubProxy;
        }

        function invokeStateChangedListeners(newState, newStateFlags, transportName) {
            registeredStateChangedListeners.forEach(function (item) {
                var scope = item.scope;
                var cb = item.cb;
                var context = item.context || null;
                safeApply(scope, function() {
                    cb.call(context, newState, newStateFlags, transportName);
                });
            });
        }

        function invokeLogListeners() {
            var args = arguments;
            registeredLogListeners.forEach(function (item) {
                var scope = item.scope;
                var cb = item.cb;
                var context = item.context || null;
                safeApply(scope, function() {
                    cb.apply(context, args);
                });
            });
        }

        function safeApply(scope, fn) {
            var phase = scope.$root.$$phase;
            if (phase === "$apply" || phase === "$digest") {
                fn();
            } else {
                scope.$apply(fn);
            }
        }

        var connectionStateEnum = $.signalR.connectionState;
        var connectionStateEnumValues = _.values(connectionStateEnum);

        function getConnectionStateFlags(connectionState) {
            return {
                isConnecting: connectionState === connectionStateEnum.connecting,
                isConnected: connectionState === connectionStateEnum.connected,
                isReconnecting: connectionState === connectionStateEnum.reconnecting,
                isDisconnected: connectionState === connectionStateEnum.disconnected,
                isUnknown: !_(connectionStateEnumValues).contains(connectionState)
            };
        }

        return {
            start: start,
            stop: stop,
            registerClientMethodListener: registerClientMethodListener,
            registerStateChangedListener: registerStateChangedListener,
            registerLogListener: registerLogListener
        };
    }
}());
