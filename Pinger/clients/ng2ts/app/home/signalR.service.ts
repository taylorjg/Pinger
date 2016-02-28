// ReSharper disable InconsistentNaming

import {Injectable, EventEmitter, Output} from "angular2/core";
import {ConnectionState} from "./connectionState";

@Injectable()
export class SignalRService {
    @Output() stateChanged: EventEmitter<ConnectionState> = new EventEmitter();
    private _hubConnection = $.hubConnection();
    constructor() {
        console.log("SignalRService.constructor");
        this._hubConnection.stateChanged(e => {
            console.log(`oldState: ${e.oldState}; newState: ${e.newState}`);
            this.raiseStateChanged();
        });
    }
    start() {
        console.log("SignalRService.start");
        this._hubConnection.start(() => {
            console.log("hubConnection.start lambda");
            this.raiseStateChanged();
        });
    }
    stop() {
        console.log("SignalRService.stop");
        this._hubConnection.stop();
    }
    private raiseStateChanged() {
        this.stateChanged.emit(new ConnectionState(this._hubConnection));
    }
}
