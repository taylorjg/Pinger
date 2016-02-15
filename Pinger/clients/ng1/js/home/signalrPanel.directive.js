(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .directive("signalrPanel", signalrPanel);

    signalrPanel.$inject = ["signalr"];

    function signalrPanel(signalr) {

        return {
            restrict: "A",
            replace: true,
            templateUrl: "home/signalrPanel.template.html",
            controller: function ($scope) {

                var vmSignalRPanel = this;
                vmSignalRPanel.connectionState = "";
                vmSignalRPanel.connectionStateClasses = {};
                vmSignalRPanel.onConnect = onConnect;
                vmSignalRPanel.connectBtnDisabled = false;
                vmSignalRPanel.onDisconnect = onDisconnect;
                vmSignalRPanel.disconnectBtnDisabled = false;
                vmSignalRPanel.transportName = "";
                vmSignalRPanel.showTransportName = false;

                function onConnect() {
                    signalr.start();
                }

                function onDisconnect() {
                    signalr.stop();
                }

                function onStateChangedEvent(_, newState, newStateFlags, transportName) {

                    vmSignalRPanel.connectBtnDisabled = !newStateFlags.isDisconnected && !newStateFlags.isUnknown;
                    vmSignalRPanel.disconnectBtnDisabled = !vmSignalRPanel.connectBtnDisabled;

                    vmSignalRPanel.connectionState = newState;
                    vmSignalRPanel.connectionStateClasses = {
                        "connectionGood": newStateFlags.isConnected,
                        "connectionBad": newStateFlags.isDisconnected,
                        "connectionWobbly": newStateFlags.isConnecting || newStateFlags.isReconnecting
                    };

                    vmSignalRPanel.transportName = transportName;
                    vmSignalRPanel.showTransportName = newStateFlags.isConnected;
                }

                signalr.subscribeToStateChangedEvents($scope, onStateChangedEvent);
            },
            controllerAs: "vmSignalRPanel"
        };
    }
}());
