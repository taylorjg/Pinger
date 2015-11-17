(function () {

    "use strict";

    var testHub = $.connection.testHub;
    console.log(testHub);

    testHub.client.ping = function (n) {
        console.log("ping", n);
    };

    $.connection.hub.start()
        .done(function() {
            console.log("$.connection.hub.start().done()");
            console.log(arguments);
        })
        .fail(function() {
            console.log("$.connection.hub.start().fail()");
            console.log(arguments);
        });
}());
