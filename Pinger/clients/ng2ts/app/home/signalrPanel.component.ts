import {Component} from "angular2/core";

@Component({
    selector: "signalr-panel",
    template: `
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                Connection state: <span id="connectionState" class="badge">{{ "Disconnected" }}</span>
                <span id="transportDetails">Transport: <span id="transportName" class="badge connectionGood">{{ "webSockets" }}</span></span>
                <button type="button" id="btnConnect" class="btn btn-sm btn-primary" (click)="onConnect()">Connect</button>
                <button type="button" id="btnDisconnect" class="btn btn-sm btn-primary" (click)="onDisconnect()">Disconnect</button>
            </div>
        </div>`
})
export class SignalRPanelComponent {
    onConnect() {
        console.log("SignalRPanelComponent.onConnect");
    }
    onDisconnect() {
        console.log("SignalRPanelComponent.onDisconnect");
    }
}
