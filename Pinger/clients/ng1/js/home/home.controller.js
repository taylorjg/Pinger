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

        function onStateChanged(newState, newStateFlags, transportName) {

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

        function onLogMessage() {
            var args = Array.prototype.slice.call(arguments);
            vm.outputMessages.push(args.join(" "));
        }

        function removeAll(arr) {
            arr.splice(0, arr.length);
        }

        signalr.registerClientMethodListener("testHub", "ping", $scope, onPing);
        signalr.registerStateChangedListener($scope, onStateChanged);
        signalr.registerLogListener($scope, onLogMessage);
    }
}());
