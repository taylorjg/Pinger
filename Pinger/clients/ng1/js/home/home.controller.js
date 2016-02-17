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

        function onPing(n) {
            vm.alertMessages.push("ping " + n);
        }

        function onLogEventWriteToOutputArea(_, message) {
            vm.outputMessages.push(message);
        }

        function onLogEventWriteToConsole(_, message) {
            console.log(message);
        }

        signalr.registerClientMethodListener("testHub", "ping", $scope, onPing);
        signalr.subscribeToLogEvents($scope, onLogEventWriteToOutputArea);
        signalr.subscribeToLogEvents($scope, onLogEventWriteToConsole);
    }
}());
