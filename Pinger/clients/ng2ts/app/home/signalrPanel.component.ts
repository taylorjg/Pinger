﻿// ReSharper disable InconsistentNaming

import {Component, OnInit, OnDestroy} from "angular2/core";
import {NgClass} from "angular2/common";
import {Subscription} from "rxjs/Subscription";
import {SignalRService} from "./signalR.Service";
import {ConnectionState} from "./connectionState";
import {ConnectionStateFlags} from "./connectionStateFlags";
import {ConnectionStatePipe} from "./connectionState.pipe";

@Component({
    selector: "signalr-panel",
    template: `
        <div class="row">
            <div class="col-md-8 col-md-offset-2">

                Connection state:
                <span
                    class="badge"
                    [ngClass]="connectionStateClasses">
                        {{ connectionState | connectionStateToString }}
                </span>

                <span *ngIf="showTransport">
                    Transport:
                    <span
                        class="badge"
                        [ngClass]="connectionStateClasses">
                            {{ transportName }}
                    </span>
                </span>

                <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    (click)="onConnect()"
                    [disabled]="connectBtnDisabled">
                        Connect
                </button>

                <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    (click)="onDisconnect()"
                    [disabled]="disconnectBtnDisabled">
                        Disconnect
                </button>
            </div>
        </div>`,
    directives: [NgClass],
    pipes: [ConnectionStatePipe]
})
export class SignalRPanelComponent implements OnInit, OnDestroy {
    private _stateChangedSubscription: Subscription<ConnectionState>;
    connectionState: number;
    connectionStateClasses = {
        connectionGood: false,
        connectionBad: false,
        connectionWobbly: false
    };
    transportName: string;
    showTransport = false;
    connectBtnDisabled = false;
    disconnectBtnDisabled = true;
    constructor(private _signalRService: SignalRService) {
    }
    onConnect() {
        this._signalRService.start();
    }
    onDisconnect() {
        this._signalRService.stop();
    }
    ngOnInit() {
        this._stateChangedSubscription = this._signalRService.stateChanged$.subscribe(this._onStateChanged.bind(this));
    }
    ngOnDestroy() {
        this._stateChangedSubscription.unsubscribe();
    }
    private _onStateChanged(e: ConnectionState) {
        this.connectionState = e.newState;
        this.connectionStateClasses.connectionGood = e.newStateFlags.isConnected;
        this.connectionStateClasses.connectionBad = e.newStateFlags.isDisconnected;
        this.connectionStateClasses.connectionWobbly = e.newStateFlags.isConnecting || e.newStateFlags.isReconnecting;
        this.transportName = e.transportName;
        this.showTransport = !!this.transportName;
        this.connectBtnDisabled = !e.newStateFlags.isDisconnected && !e.newStateFlags.isUnknown;
        this.disconnectBtnDisabled = !this.connectBtnDisabled;
    }
}
