import {Component} from "angular2/core";
import {SignalRService} from "./home/signalR.Service";
import {SignalRPanelComponent} from "./home/signalrPanel.component";
import {AlertAreaComponent} from "./home/alertArea.component";
import {OutputAreaComponent} from "./home/outputArea.component";

@Component({
    selector: "app",
    template: `
        <signalr-panel></signalr-panel>
        <hr class="col-md-7 col-md-offset-2" />
        <alert-area></alert-area>
        <output-area></output-area>
        <hr class="col-md-7 col-md-offset-2" />
        <signalr-panel></signalr-panel>`,
    directives: [SignalRPanelComponent, AlertAreaComponent, OutputAreaComponent],
    providers: [SignalRService]
})
export class AppComponent {
}
