(function() {

    "use strict";

    // ReSharper disable FunctionsUsedBeforeDeclared

    angular.module("appPinger")
        .filter("connectionStateToString", connectionStateToString);

    function connectionStateToString() {

        var connectionStateEnum = $.signalR.connectionState;

        return function (connectionState) {
            switch (connectionState) {
                case connectionStateEnum.connecting: return "Connecting";
                case connectionStateEnum.connected: return "Connected";
                case connectionStateEnum.reconnecting: return "Reconnecting";
                case connectionStateEnum.disconnected: return "Disconnected";
                default: return "?";
            }
        };
    }
}());
