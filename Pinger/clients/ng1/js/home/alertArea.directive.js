(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .directive("alertArea", alertArea);

    function alertArea() {
        return {
            restrict: "A",
            replace: true,
            templateUrl: "home/alertArea.template.html",
            scope: {
                messages: "="
            },
            link: function(scope, element) {
                scope.$watch("messages", function() {
                    element.scrollTop(1E10);
                });
            }
        };
    }
}());
