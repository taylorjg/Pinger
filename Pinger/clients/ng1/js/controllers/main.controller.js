(function () {

    "use strict";

    var app = angular.module("appPinger");

    var MainController = function (/* $scope */) {
        var vm = this;
        vm.message = "Hello";
    };

    MainController.$inject = ["$scope"];

    app.controller("MainController", MainController);

}());
