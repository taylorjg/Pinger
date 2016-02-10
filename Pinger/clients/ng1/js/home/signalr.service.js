(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .service("signalr", signalr);

    signalr.$inject = ["$rootScope", "$filter", "$timeout"];

    function signalr($rootScope, $filter, $timeout) {

        var hubConnection = $.hubConnection();
        var hubProxies = {};
        var clientMethodForwarders = [];
        var registeredStateChangedListeners = [];
        var registeredLogListeners = [];
        var connectionStateToString = $filter("connectionStateToString");

        // ReSharper disable InconsistentNaming
        var SIGNALR_STATE_CHANGED_EVENT = "signalr_state_changed";
        var SIGNALR_LOG_MESSAGE_EVENT = "signalr_log_message";
        // ReSharper restore InconsistentNaming

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
            var clientMethodForwarder = getClientMethodForwarder(hubName, methodName);
            clientMethodForwarder.targets.push({
                scope: scope,
                cb: cb,
                context: context
            });
        }

        function registerStateChangedListener(scope, cb, context) {
            registeredStateChangedListeners.push({
                scope: scope,
                cb: cb,
                context: context
            });

            notifyStateChangedListenersOfStateChange({
                oldState: undefined,
                newState: hubConnection.state
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

        hubConnection.stateChanged(function(states) {
            notifyLogListenersOfStateChange(states);
            notifyStateChangedListenersOfStateChange(states);
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

        function getClientMethodForwarder(hubName, methodName) {

            var clientMethodForwarder = _(clientMethodForwarders).findWhere({
                hubName: hubName,
                methodName: methodName
            });

            if (!clientMethodForwarder) {
                clientMethodForwarder = {
                    hubName: hubName,
                    methodName: methodName,
                    targets: []
                };
                clientMethodForwarders.push(clientMethodForwarder);
                var hubProxy = getHubProxy(hubName);
                hubProxy.on(methodName, function () {
                    var args = arguments;
                    clientMethodForwarder.targets.forEach(function(item) {
                        var scope = item.scope;
                        var cb = item.cb;
                        var context = item.context;
                        safeApply(scope, function() {
                            cb.apply(context, args);
                        });
                    });
                });
            }

            return clientMethodForwarder;
        }

        function invokeStateChangedListeners(newState, newStateFlags, transportName) {
            registeredStateChangedListeners.forEach(function (item) {
                var scope = item.scope;
                var cb = item.cb;
                var context = item.context;
                safeApply(scope, function() {
                    cb.call(context, newState, newStateFlags, transportName);
                });
            });
            raiseStateChangedEvent(newState, newStateFlags, transportName);
        }

        function invokeLogListeners() {
            var args = arguments;
            registeredLogListeners.forEach(function (item) {
                var scope = item.scope;
                var cb = item.cb;
                var context = item.context;
                safeApply(scope, function() {
                    cb.apply(context, args);
                });
            });
            raiseLogEvent.apply(null, arguments);
        }

        function safeApply(scope, fn) {
            var phase = scope.$root.$$phase;
            if (phase === "$apply" || phase === "$digest") {
                $timeout(fn);
            } else {
                scope.$apply(fn);
            }
        }

        function notifyLogListenersOfStateChange(states) {
            var oldStateName = connectionStateToString(states.oldState);
            var newStateName = connectionStateToString(states.newState);
            invokeLogListeners("[stateChanged]", "oldState:", oldStateName, "newState:", newStateName);
        }

        function notifyStateChangedListenersOfStateChange(states) {
            var newStateFlags = getConnectionStateFlags(states.newState);
            var transportName = newStateFlags.isConnected ? hubConnection.transport.name : "";
            invokeStateChangedListeners(states.newState, newStateFlags, transportName);
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

        function raiseStateChangedEvent() {
            raiseEvent(SIGNALR_STATE_CHANGED_EVENT, arguments);
        }

        function raiseLogEvent() {
            raiseEvent(SIGNALR_LOG_MESSAGE_EVENT, arguments);
        }

        function raiseEvent(name, args) {
            $rootScope.$emit.apply($rootScope, [name].concat([].slice.call(args)));
        }

        function subscribeToStateChangedEvents(scope, listener) {
            subscribe(scope, listener, SIGNALR_STATE_CHANGED_EVENT);
        }

        function subscribeToLogEvents(scope, listener) {
            subscribe(scope, listener, SIGNALR_LOG_MESSAGE_EVENT);
        }

        function subscribe(scope, listener, name) {
            var deregistrationFn = $rootScope.$on(name, function () {
                var args = arguments;
                safeApply(scope, function () {
                    listener.apply(null, args);
                });
            });
            scope.$on("$destroy", deregistrationFn);
        }

        $timeout(function() {
            notifyStateChangedListenersOfStateChange({
                oldState: undefined,
                newState: hubConnection.state
            });
        });

        return {
            start: start,
            stop: stop,
            registerClientMethodListener: registerClientMethodListener,
            registerStateChangedListener: registerStateChangedListener,
            registerLogListener: registerLogListener,
            subscribeToStateChangedEvents: subscribeToStateChangedEvents,
            subscribeToLogEvents: subscribeToLogEvents
        };
    }
}());
