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
        vm.transportName = undefined;
        vm.onConnect = onConnect;
        vm.onDisconnect = onDisconnect;
        vm.onClear = onClear;
        vm.connectBtnDisabled = false;
        vm.disconnectBtnDisabled = false;
        vm.showTransportName = false;

        function onConnect() {
            signalr.start();

            // Temporary code - should really be doing this in onStateChanged
            vm.connectBtnDisabled = true;
            vm.disconnectBtnDisabled = false;
            vm.showTransportName = true;
        }

        function onDisconnect() {
            signalr.stop();

            // Temporary code - should really be doing this in onStateChanged
            vm.connectBtnDisabled = false;
            vm.disconnectBtnDisabled = true;
            vm.showTransportName = false;
        }

        function onClear() {
            removeAll(vm.alertMessages);
            removeAll(vm.outputMessages);
        }

        function onPing(n) {
            vm.alertMessages.push("ping " + n);
        }

        function onStateChanged(newState, transportName) {

            //var enableConnectionButton = newFlags.isDisconnected || newFlags.isUnknown;
            //var disableConnectionButton = !enableConnectionButton;
            //var disableDisconnectionButton = enableConnectionButton;

            //$btnConnect.prop("disabled", disableConnectionButton);
            //$btnDisconnect.prop("disabled", disableDisconnectionButton);

            //$connectionState.text(newStateName);
            //$connectionState.toggleClass("connectionGood", newFlags.isConnected);
            //$connectionState.toggleClass("connectionBad", newFlags.isDisconnected);
            //$connectionState.toggleClass("connectionWobbly", newFlags.isConnecting || newFlags.isReconnecting);

            //$transportDetails.toggle(newFlags.isConnected);
            //$transportName.text(transportName);

            vm.connectionState = newState;
            vm.transportName = transportName;
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
