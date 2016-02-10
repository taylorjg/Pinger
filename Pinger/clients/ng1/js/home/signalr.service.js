(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .service("signalr", signalr);

    signalr.$inject = ["$rootScope", "$filter", "$timeout"];

    var SIGNALR_STATE_CHANGED_EVENT = "signalr_state_changed";
    var SIGNALR_LOG_MESSAGE_EVENT = "signalr_log_message";

    function signalr($rootScope, $filter, $timeout) {

        var hubConnection = $.hubConnection();
        var hubProxies = {};
        var clientMethodForwarders = [];
        var connectionStateToStringFilter = $filter("connectionStateToString");
        var connectionStateEnum = $.signalR.connectionState;
        var connectionStateEnumValues = _.values(connectionStateEnum);

        function start() {
            hubConnection.start()
                .done(function hubConnectionDone() {
                    raiseLogEvent("[start.done]");
                })
                .fail(function hubConnectionFail(reason) {
                    raiseLogEvent("[start.fail]", "reason:", reason);
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

        function subscribeToStateChangedEvents(scope, listener) {
            subscribeHelper(scope, listener, SIGNALR_STATE_CHANGED_EVENT);
        }

        function subscribeToLogEvents(scope, listener) {
            subscribeHelper(scope, listener, SIGNALR_LOG_MESSAGE_EVENT);
        }

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

        function notifyLogListenersOfStateChange(states) {
            var oldStateName = connectionStateToStringFilter(states.oldState);
            var newStateName = connectionStateToStringFilter(states.newState);
            raiseLogEvent("[stateChanged]", "oldState:", oldStateName, "newState:", newStateName);
        }

        function notifyStateChangedListenersOfStateChange(states) {
            var newStateFlags = getConnectionStateFlags(states.newState);
            var transportName = newStateFlags.isConnected ? hubConnection.transport.name : "";
            raiseStateChangedEvent(states.newState, newStateFlags, transportName);
        }

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
            raiseEventHelper(SIGNALR_STATE_CHANGED_EVENT, arguments);
        }

        function raiseLogEvent() {
            raiseEventHelper(SIGNALR_LOG_MESSAGE_EVENT, arguments);
        }

        function raiseEventHelper(name, args) {
            $rootScope.$emit.apply($rootScope, [name].concat([].slice.call(args)));
        }

        function subscribeHelper(scope, listener, name) {
            var deregistrationFn = $rootScope.$on(name, function () {
                var args = arguments;
                safeApply(scope, function () {
                    listener.apply(null, args);
                });
            });
            scope.$on("$destroy", deregistrationFn);
        }

        function safeApply(scope, fn) {
            var phase = scope.$root.$$phase;
            if (phase === "$apply" || phase === "$digest") {
                $timeout(fn);
            } else {
                scope.$apply(fn);
            }
        }

        hubConnection.starting(function () {
            raiseLogEvent("[starting]");
        });

        hubConnection.connectionSlow(function () {
            raiseLogEvent("[connectionSlow]");
        });

        hubConnection.disconnected(function () {
            raiseLogEvent("[disconnected]");
        });

        hubConnection.reconnecting(function () {
            raiseLogEvent("[reconnecting]");
        });

        hubConnection.reconnected(function () {
            raiseLogEvent("[reconnected]");
        });

        hubConnection.stateChanged(function (states) {
            notifyLogListenersOfStateChange(states);
            notifyStateChangedListenersOfStateChange(states);
        });

        hubConnection.error(function (errorData) {
            raiseLogEvent("[error]", "errorData:", errorData);
        });

        $timeout(function () {
            notifyStateChangedListenersOfStateChange({
                oldState: undefined,
                newState: hubConnection.state
            });
        });

        return {
            start: start,
            stop: stop,
            registerClientMethodListener: registerClientMethodListener,
            subscribeToStateChangedEvents: subscribeToStateChangedEvents,
            subscribeToLogEvents: subscribeToLogEvents
        };
    }
}());
