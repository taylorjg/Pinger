import {Injectable, EventEmitter, Output} from "angular2/core";
import {ConnectionState} from "./connectionState";

@Injectable()
export class SignalRService {
    @Output() stateChanged: EventEmitter<ConnectionState> = new EventEmitter();
    private hubConnection = $.hubConnection();
    constructor() {
        console.log("SignalRService.constructor");
        this.hubConnection.stateChanged(e => {
            console.log(`oldState: ${e.oldState}; newState: ${e.newState}`);
            this.raiseStateChanged(e.newState);
        });
    }
    start() {
        console.log("SignalRService.start");
        this.hubConnection.start(() => {
            console.log("hubConnection.start lambda");
            this.raiseStateChanged(this.hubConnection.state);
        });
    }
    stop() {
        console.log("SignalRService.stop");
        this.hubConnection.stop();
    }
    private raiseStateChanged(connectionState) {
        var transportName = "";
        if (this.hubConnection.transport && this.hubConnection.transport.name) {
            transportName = this.hubConnection.transport.name;
        }
        this.stateChanged.emit(new ConnectionState(connectionState, transportName));
    }
}
