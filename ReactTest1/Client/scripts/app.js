(function() {

    "use strict";

    var hubConnection = $.hubConnection();
    var hubProxy = hubConnection.createHubProxy("testHub");

    hubProxy.on("ping", function(n) {
        console.log("ping", n);
    });

    hubConnection.start()
        .done(function() {
            console.log("hubConnection done");
        })
        .fail(function(reason) {
            console.log("hubConnection fail - reason:", reason);
        });
}());
