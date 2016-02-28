import {Component} from "angular2/core";
import {SignalRService} from "./signalR.Service";
import {ConnectionState} from "./connectionState";
import {ConnectionStateFlags} from "./connectionStateFlags";

@Component({
    selector: "signalr-panel",
    template: `
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                Connection state: <span id="connectionState" class="badge">{{ connectionState.newState }}</span>
                <span id="transportDetails">Transport: <span id="transportName" class="badge connectionGood">{{ connectionState.transportName }}</span></span>
                <button type="button" id="btnConnect" class="btn btn-sm btn-primary" (click)="onConnect()">Connect</button>
                <button type="button" id="btnDisconnect" class="btn btn-sm btn-primary" (click)="onDisconnect()">Disconnect</button>
            </div>
        </div>`,
    providers: [SignalRService]
})
export class SignalRPanelComponent {
    stateChangedSubscription = null;
    connectionState = new ConnectionState(4);
    constructor(private signalRService: SignalRService) {
    }
    onConnect() {
        console.log("SignalRPanelComponent.onConnect");
        this.signalRService.start();
    }
    onDisconnect() {
        console.log("SignalRPanelComponent.onDisconnect");
        this.signalRService.stop();
    }
    ngOnInit() {
        console.log("SignalRPanelComponent.ngOnInit");
        this.stateChangedSubscription = this.signalRService.stateChanged.subscribe(e => {
            this.connectionState = e;
        });
    }
    ngOnDestroy() {
        console.log("SignalRPanelComponent.ngOnDestroy");
        this.stateChangedSubscription.unsubscribe();
    }
}
