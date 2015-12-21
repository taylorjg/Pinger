(function () {

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
        vm.connectionState = "cn?";
        vm.transportName = "tn?";
        vm.onConnect = onConnect;
        vm.onDisconnect = onDisconnect;
        vm.onClear = onClear;
        vm.connectBtnDisabled = false;
        vm.disconnectBtnDisabled = false;

        function onConnect() {
            signalr.start();
            vm.connectBtnDisabled = true;
            vm.disconnectBtnDisabled = false;
        }

        function onDisconnect() {
            signalr.stop();
            vm.connectBtnDisabled = false;
            vm.disconnectBtnDisabled = true;
        }

        function onClear() {
            removeAll(vm.alertMessages);
            removeAll(vm.outputMessages);
        }

        // function signalrStateChangedListener(oldStateName, oldFlags, newStateName, newFlags, transportName) {
        // 
        //     var enableConnectionButton = newFlags.isDisconnected || newFlags.isUnknown;
        //     var disableConnectionButton = !enableConnectionButton;
        //     var disableDisconnectionButton = enableConnectionButton;
        // 
        //     $btnConnect.prop("disabled", disableConnectionButton);
        //     $btnDisconnect.prop("disabled", disableDisconnectionButton);
        // 
        //     $connectionState.text(newStateName);
        //     $connectionState.toggleClass("connectionGood", newFlags.isConnected);
        //     $connectionState.toggleClass("connectionBad", newFlags.isDisconnected);
        //     $connectionState.toggleClass("connectionWobbly", newFlags.isConnecting || newFlags.isReconnecting);
        // 
        //     $transportDetails.toggle(newFlags.isConnected);
        //     $transportName.text(transportName);
        // }

         function onPing(n) {
             vm.alertMessages.push("ping " + n);
         }

        function signalrLogListener() {
            var args = Array.prototype.slice.call(arguments);
            vm.outputMessages.push(args.join(" "));
        }

        function removeAll(arr) {
            arr.splice(0, arr.length);
        }

        signalr.registerClientMethodListener("testHub", "ping", $scope, onPing);
        // signalr.registerStateChangedListener($scope, signalrStateChangedListener);
        signalr.registerLogListener($scope, signalrLogListener);
    }
}());
