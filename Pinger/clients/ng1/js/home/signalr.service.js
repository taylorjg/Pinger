(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .service("signalr", signalr);

    function signalr() {

        var registeredListeners = [];

        function start() {
            window.setTimeout(
                function() {
                    invokeRegisteredListeners("[start.done]");
                }, 1000);
        }

        function stop() {
        }

        function registerListener(scope, cb, context) {
            registeredListeners.push({
                scope: scope,
                cb: cb,
                context: context
            });
        }

        function unregisterListener(scope, cb) {
            registeredListeners = registeredListeners.filter(function(registeredListener) {
                return registeredListener.scope !== scope || registeredListener.cb !== cb;
            });
        }

        function invokeRegisteredListeners() {
            var args = arguments;
            registeredListeners.forEach(function (registeredListener) {
                var scope = registeredListener.scope;
                var cb = registeredListener.cb;
                var context = registeredListener.context || null;
                scope.$apply(function() {
                    cb.apply(context, args);
                });
            });
        }

        return {
            start: start,
            stop: stop,
            registerListener: registerListener,
            unregisterListener: unregisterListener
        };
    }
}());
