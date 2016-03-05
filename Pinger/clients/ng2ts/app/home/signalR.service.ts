// ReSharper disable InconsistentNaming

import {Injectable, EventEmitter, Output} from "angular2/core";
import {ConnectionState} from "./connectionState";

@Injectable()
export class SignalRService {
    @Output() stateChanged: EventEmitter<ConnectionState> = new EventEmitter();
    @Output() logEvent: EventEmitter<string> = new EventEmitter();
    private _hubConnection = $.hubConnection();
    constructor() {
        this._hubConnection.stateChanged(_ => {
            this._raiseStateChanged();
        });
    }
    start() {
        this._hubConnection.start().then(
            () => {
                this._raiseLogEvent("[start.done]");
            },
            (reason: string) => {
                this._raiseLogEvent(["[start.fail]", "reason:", reason].join(" "));
            });
    }
    stop() {
        this._hubConnection.stop();
    }
    private _raiseStateChanged() {
        var connectionState = new ConnectionState(this._hubConnection);
        this._raiseLogEvent(["newState", connectionState.newState].join(" "));
        this.stateChanged.emit(connectionState);
    }
    private _raiseLogEvent(s: string) {
        this.logEvent.emit(s);
    }
}
