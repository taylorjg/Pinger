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
                var scrollableMessageAreaElement = element.find(".scrollableMessageArea");
                if (scrollableMessageAreaElement) {
                    scope.$watchCollection("vmOutputArea.messages", function (messages) {
                        scrollableMessageAreaElement.html(messages.join("\n"));
                        scrollableMessageAreaElement.scrollTop(1E10);
                    });
                }
            },
            controller: function() {

                var vm = this;
                vm.onClear = onClear;

                function onClear() {
                    _.remove(vm.messages);
                }
            },
            controllerAs: "vmOutputArea",
            bindToController: true
        };
    }
}());
