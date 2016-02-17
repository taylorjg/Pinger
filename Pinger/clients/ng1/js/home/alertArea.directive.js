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
                var scrollableMessageAreaElement = element.find(".scrollableMessageArea");
                if (scrollableMessageAreaElement) {
                    scope.$watchCollection("messages", function() {
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
            controllerAs: "vmAlertArea",
            bindToController: true
        };
    }
}());
