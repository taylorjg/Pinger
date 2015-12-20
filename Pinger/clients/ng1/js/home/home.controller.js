(function () {

    "use strict";

    // ReSharper disable InconsistentNaming
    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .controller("HomeController", HomeController);

    HomeController.$inject = ["$scope", "signalr"];

    function HomeController(/* $scope, signalr */) {
        var vm = this;
        vm.alertMessages = ["Alert Message 1", "Alert Message 2", "Alert Message 3"];
        vm.outputMessages = ["Output Message 1", "Output Message 2", "Output Message 3"];
    }
}());
