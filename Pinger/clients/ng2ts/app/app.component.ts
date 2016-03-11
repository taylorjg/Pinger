// ReSharper disable InconsistentNaming

import {Component, OnInit, OnDestroy, ViewChild} from "angular2/core";
import {Subscription} from "rxjs/Subscription";
import {SignalRService} from "./home/signalR.Service";
import {SignalRPanelComponent} from "./home/signalrPanel.component";
import {AlertAreaComponent} from "./home/alertArea.component";
import {OutputAreaComponent} from "./home/outputArea.component";

@Component({
    selector: "app",
    template: `
        <signalr-panel></signalr-panel>
        <hr class="col-md-7 col-md-offset-2" />
        <alert-area #alertArea></alert-area>
        <output-area #outputArea></output-area>
        <hr class="col-md-7 col-md-offset-2" />
        <signalr-panel></signalr-panel>`,
    directives: [SignalRPanelComponent, AlertAreaComponent, OutputAreaComponent],
    providers: [SignalRService]
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild("alertArea") private _alertArea: AlertAreaComponent;
    @ViewChild("outputArea") private _outputArea: OutputAreaComponent;
    private _pingSubscription: Subscription<any[]>;
    private _logEventSubscription: Subscription<string>;
    constructor(private _signalRService: SignalRService) {
    }
    ngOnInit() {
        var ping$ = this._signalRService.registerClientMethodListener("testHub", "ping");
        this._pingSubscription = ping$.subscribe(this._onPing.bind(this));
        this._logEventSubscription = this._signalRService.logEvent$.subscribe(this._onLogEvent.bind(this));
    }
    ngOnDestroy() {
        this._pingSubscription.unsubscribe();
        this._logEventSubscription.unsubscribe();
    }
    private _onPing([n]: any[]) {
        this._alertArea.addMessage(`ping ${n}`);
    }
    private _onLogEvent(message: string) {
        this._outputArea.addMessage(message);
    }
}
