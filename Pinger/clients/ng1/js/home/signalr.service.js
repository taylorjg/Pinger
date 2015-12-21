(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .service("signalr", signalr);

    function signalr() {

        var hubConnection = $.hubConnection();
        var hubProxies = {};
        var registeredClientMethodListeners = [];
        var registeredStateChangedListeners = [];
        var registeredLogListeners = [];

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
            // TODO: use a filter to convert a connection state value to a string ?
            //var oldStateName = connectionStateToString(states.oldState);
            //var newStateName = connectionStateToString(states.newState);
            var oldStateName = states.oldState.toString();
            var newStateName = states.newState.toString();
            invokeLogListeners("[stateChanged]", "oldState:", oldStateName, "newState:", newStateName);
            var transportName = hubConnection.transport ? hubConnection.transport.name : "";
            invokeStateChangedListeners(states.newState, transportName);
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

        function invokeStateChangedListeners(newState, transportName) {
            registeredStateChangedListeners.forEach(function (item) {
                var scope = item.scope;
                var cb = item.cb;
                var context = item.context || null;
                safeApply(scope, function() {
                    cb.call(context, newState, transportName);
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

        return {
            start: start,
            stop: stop,
            registerClientMethodListener: registerClientMethodListener,
            registerStateChangedListener: registerStateChangedListener,
            registerLogListener: registerLogListener
        };
    }
}());
