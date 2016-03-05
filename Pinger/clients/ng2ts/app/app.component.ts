// ReSharper disable InconsistentNaming

import {Component, ViewChild} from "angular2/core";
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
export class AppComponent {
    @ViewChild("alertArea") private _alertArea: AlertAreaComponent;
    @ViewChild("outputArea") private _outputArea: OutputAreaComponent;
    private _logEventSubscription = null;
    constructor(private _signalRService: SignalRService) {
    }
    ngOnInit() {
        this._logEventSubscription = this._signalRService.logEvent.subscribe(message => {
            this._outputArea.addMessage(message);
        });
    }
    ngOnDestroy() {
        this._logEventSubscription.unsubscribe();
    }
}
