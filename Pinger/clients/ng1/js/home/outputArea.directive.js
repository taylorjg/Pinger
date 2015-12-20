(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .directive("outputArea", outputArea);

    function outputArea() {
        return {
            restrict: "A",
            replace: true,
            templateUrl: "home/outputArea.template.html",
            scope: {
                messages: "="
            },
            link: function(scope, element) {
                scope.$watch("messages", function(messages) {
                    element.html(messages.join("\n"));
                    element.scrollTop(1E10);
                });
            }
        };
    }
}());
