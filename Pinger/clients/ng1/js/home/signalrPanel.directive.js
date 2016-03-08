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

                var vm = this;
                vm.connectionState = "";
                vm.connectionStateClasses = {};
                vm.onConnect = onConnect;
                vm.connectBtnDisabled = false;
                vm.onDisconnect = onDisconnect;
                vm.disconnectBtnDisabled = false;
                vm.transportName = "";
                vm.showTransport = false;

                function onConnect() {
                    signalr.start();
                }

                function onDisconnect() {
                    signalr.stop();
                }

                function onStateChangedEvent(_, newState, newStateFlags, transportName) {

                    vm.connectBtnDisabled = !newStateFlags.isDisconnected && !newStateFlags.isUnknown;
                    vm.disconnectBtnDisabled = !vm.connectBtnDisabled;

                    vm.connectionState = newState;
                    vm.connectionStateClasses = {
                        "connectionGood": newStateFlags.isConnected,
                        "connectionBad": newStateFlags.isDisconnected,
                        "connectionWobbly": newStateFlags.isConnecting || newStateFlags.isReconnecting
                    };

                    vm.transportName = transportName;
                    vm.showTransport = !!transportName;
                }

                signalr.subscribeToStateChangedEvents($scope, onStateChangedEvent);
            },
            controllerAs: "vmSignalRPanel"
        };
    }
}());
