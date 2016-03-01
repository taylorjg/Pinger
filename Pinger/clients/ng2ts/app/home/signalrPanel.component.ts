// ReSharper disable InconsistentNaming

import {Component} from "angular2/core";
import {NgClass} from 'angular2/common';
import {SignalRService} from "./signalR.Service";
import {ConnectionState} from "./connectionState";
import {ConnectionStateFlags} from "./connectionStateFlags";

@Component({
    selector: "signalr-panel",
    template: `
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                Connection state: <span id="connectionState" class="badge" [ngClass]="connectionStateClasses">{{ connectionState() }}</span>
                <span id="transportDetails" *ngIf="showTransportName">Transport: <span id="transportName" class="badge connectionGood">{{ transportName() }}</span></span>
                <button type="button" id="btnConnect" class="btn btn-sm btn-primary" (click)="onConnect()">Connect</button>
                <button type="button" id="btnDisconnect" class="btn btn-sm btn-primary" (click)="onDisconnect()">Disconnect</button>
            </div>
        </div>`,
    directives: [NgClass]
})
export class SignalRPanelComponent {
    private _stateChangedSubscription = null;
    private _connectionState: ConnectionState = null;
    connectionStateClasses = {
        connectionGood: false,
        connectionBad: false,
        connectionWobbly: false
    };
    showTransportName = false;
    constructor(private signalRService: SignalRService) {
    }
    connectionState(): string {
        return this._connectionState != null ? this._connectionState.newState.toString() : "?";
    }
    transportName(): string {
        return this._connectionState != null ? this._connectionState.transportName : "";
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
        this._stateChangedSubscription = this.signalRService.stateChanged.subscribe((e: ConnectionState) => {
            this._connectionState = e;
            this.connectionStateClasses.connectionGood = e.newStateFlags.isConnected;
            this.connectionStateClasses.connectionBad = e.newStateFlags.isDisconnected;
            this.connectionStateClasses.connectionWobbly = e.newStateFlags.isConnecting || e.newStateFlags.isReconnecting;
            this.showTransportName = e.newStateFlags.isConnected;
        });
    }
    ngOnDestroy() {
        console.log("SignalRPanelComponent.ngOnDestroy");
        this._stateChangedSubscription.unsubscribe();
    }
}
