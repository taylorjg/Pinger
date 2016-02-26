import {Component} from "angular2/core";
import {SignalRService} from "./signalR.Service";

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
        </div>`,
    providers: [SignalRService]
})
export class SignalRPanelComponent {
    subscription = null;
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
        this.subscription = this.signalRService.thing.subscribe(s => {
            console.log("SignalRPanelComponent.onThing (%s)", s);
        });
    }
    ngOnDestroy() {
        console.log("SignalRPanelComponent.ngOnDestroy");
        this.subscription.unsubscribe();
    }
}
