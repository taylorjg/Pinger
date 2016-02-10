(function() {

    "use strict";

    // ReSharper disable InconsistentNaming
    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .controller("HomeController", HomeController);

    HomeController.$inject = ["$scope", "signalr"];

    function HomeController($scope, signalr) {

        var vm = this;
        vm.alertMessages = [];
        vm.outputMessages = [];
        vm.connectionState = undefined;
        vm.connectionStateClasses = {};
        vm.onConnect = onConnect;
        vm.connectBtnDisabled = false;
        vm.onDisconnect = onDisconnect;
        vm.disconnectBtnDisabled = false;
        vm.onClear = onClear;
        vm.transportName = undefined;
        vm.showTransportName = false;

        function onConnect() {
            signalr.start();
        }

        function onDisconnect() {
            signalr.stop();
        }

        function onClear() {
            removeAll(vm.alertMessages);
            removeAll(vm.outputMessages);
        }

        function onPing(n) {
            vm.alertMessages.push("ping " + n);
        }

        function onStateChanged(_, newState, newStateFlags, transportName) {

            console.log(arguments);

            vm.connectBtnDisabled = !newStateFlags.isDisconnected && !newStateFlags.isUnknown;
            vm.disconnectBtnDisabled = !vm.connectBtnDisabled;

            vm.connectionState = newState;
            vm.connectionStateClasses = {
                "connectionGood": newStateFlags.isConnected,
                "connectionBad": newStateFlags.isDisconnected,
                "connectionWobbly": newStateFlags.isConnecting || newStateFlags.isReconnecting
            };

            vm.transportName = transportName;
            vm.showTransportName = newStateFlags.isConnected;
        }

        function onLogMessageToOutputArea(_, message) {
            vm.outputMessages.push(message);
        }

        function onLogMessageToConsole(_, message) {
            console.log(message);
        }

        function removeAll(arr) {
            arr.splice(0, arr.length);
        }

        signalr.registerClientMethodListener("testHub", "ping", $scope, onPing);
        signalr.subscribeToStateChangedEvents($scope, onStateChanged);
        signalr.subscribeToLogEvents($scope, onLogMessageToOutputArea);
        signalr.subscribeToLogEvents($scope, onLogMessageToConsole);
    }
}());
