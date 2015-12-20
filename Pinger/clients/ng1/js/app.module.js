(function () {

    "use strict";

    // https://github.com/angular/angular-hint/issues/81
    if (angular.hint) {
        angular.hint.onAny(function () {
            if (arguments.length >= 2) {
                var severity = arguments[1];
                var fn;
                switch (severity) {
                    case 1: /* SEVERITY_ERROR */ fn = console.error; break;
                    case 2: /* SEVERITY_WARNING */ fn = console.warn; break;
                    case 3: /* SEVERITY_SUGGESTION */ fn = console.info; break;
                    default: fn = console.log; break;
                }
                var prefix = "[angular-hint]";
                if (arguments.length === 2) {
                    fn.call(console, prefix, arguments[0]);
                }
                else {
                    fn.call(console, prefix, arguments[0], "(" + arguments[2] + ")");
                }
            }
        });
    }

    angular.module("appPinger", []);
}());
