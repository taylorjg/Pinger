(function() {

    "use strict";

    // https://github.com/angular/angular-hint/issues/81
    if (angular.hint) {
        angular.hint.onAny(console.log.bind(console));
    }

    var app = angular.module("pinger", []);

    app.controller("Blah", [function () {
    }]);

    $(document).ready(function () {

        var $connectionState = $("#connectionState");
        var $transportDetails = $("#transportDetails");
        var $transportName = $("#transportName");
        var $btnConnect = $("#btnConnect");
        var $btnDisconnect = $("#btnDisconnect");
        var $btnClear = $("#btnClear");

        var alertMessageArea = window.pinger.alertMessageArea();
        var outputMessageArea = window.pinger.outputMessageArea();
        var backend = window.pinger.backend(outputMessageArea.log);

        var handleStateChanged = function (oldStateName, oldFlags, newStateName, newFlags, transportName) {

            var enableConnectionButton = newFlags.isDisconnected || newFlags.isUnknown;
            var disableConnectionButton = !enableConnectionButton;
            var disableDisconnectionButton = enableConnectionButton;

            $btnConnect.prop("disabled", disableConnectionButton);
            $btnDisconnect.prop("disabled", disableDisconnectionButton);

            $connectionState.text(newStateName);
            $connectionState.toggleClass("connectionGood", newFlags.isConnected);
            $connectionState.toggleClass("connectionBad", newFlags.isDisconnected);
            $connectionState.toggleClass("connectionWobbly", newFlags.isConnecting || newFlags.isReconnecting);

            $transportDetails.toggle(newFlags.isConnected);
            $transportName.text(transportName);
        };

        $btnConnect.click(function () {
            backend.start();
        });

        $btnDisconnect.click(function() {
            backend.stop();
        });

        $btnClear.click(function() {
            alertMessageArea.clear();
            outputMessageArea.clear();
        });

        backend.onMethod("testHub", "ping", function (n) {
            alertMessageArea.log("ping " + n);
        });

        backend.onStateChanged(handleStateChanged);
    });
}());
