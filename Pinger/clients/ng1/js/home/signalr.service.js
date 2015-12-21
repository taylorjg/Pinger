(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .service("signalr", signalr);

    function signalr() {

        var hubConnection = $.hubConnection();
        //var hubProxies = {};
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

        function registerLogListener(scope, cb, context) {
            registeredLogListeners.push({
                scope: scope,
                cb: cb,
                context: context
            });
        }

        function unregisterLogListener(scope, cb) {
            registeredLogListeners = registeredLogListeners.filter(function(registeredListener) {
                return registeredListener.scope !== scope || registeredListener.cb !== cb;
            });
        }

        // onStateChanged(scope, cb, context)
        // onMethod(hubName, methodName, scope, cb, context)

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
        });

        hubConnection.error(function (errorData) {
            invokeLogListeners("[error]", "errorData:", errorData);
        });

        function invokeLogListeners() {
            var args = arguments;
            registeredLogListeners.forEach(function (registeredListener) {
                var scope = registeredListener.scope;
                var cb = registeredListener.cb;
                var context = registeredListener.context || null;
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
            // registerClientMethodListener
            // registerStateChangedListener
            registerLogListener: registerLogListener,
            // unregisterClientMethodListener
            // unregisterStateChangedListener
            unregisterLogListener: unregisterLogListener
        };
    }
}());
