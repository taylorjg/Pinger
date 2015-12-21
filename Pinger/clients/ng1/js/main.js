﻿(function () {

    // ReSharper disable FunctionsUsedBeforeDeclared

    "use strict";

    $(document).ready(function () {

        var $connectionState = $("#connectionState");
        var $transportDetails = $("#transportDetails");
        var $transportName = $("#transportName");
        var $btnConnect = $("#btnConnect");
        var $btnDisconnect = $("#btnDisconnect");

        var alertMessageArea = window.pinger.alertMessageArea();
        var outputMessageArea = window.pinger.outputMessageArea();
        var backend = window.pinger.backend(outputMessageArea.log);

        backend.onMethod("testHub", "ping", function (n) {
            alertMessageArea.log("ping " + n);
        });

        backend.onStateChanged(handleStateChanged);

        function handleStateChanged(oldStateName, oldFlags, newStateName, newFlags, transportName) {

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
        }
    });
}());
