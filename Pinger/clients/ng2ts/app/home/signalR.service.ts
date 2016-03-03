// ReSharper disable InconsistentNaming

import {Injectable, EventEmitter, Output} from "angular2/core";
import {ConnectionState} from "./connectionState";

@Injectable()
export class SignalRService {
    @Output() stateChanged: EventEmitter<ConnectionState> = new EventEmitter();
    private _hubConnection = $.hubConnection();
    constructor() {
        this._hubConnection.stateChanged(_ => {
            this._raiseStateChanged();
        });
    }
    start() {
        this._hubConnection.start(() => {
            this._raiseStateChanged();
        });
    }
    stop() {
        this._hubConnection.stop();
    }
    private _raiseStateChanged() {
        this.stateChanged.emit(new ConnectionState(this._hubConnection));
    }
}
