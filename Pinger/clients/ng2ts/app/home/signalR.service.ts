// ReSharper disable InconsistentNaming

import {Injectable, EventEmitter, Output} from "angular2/core";
import {ConnectionState} from "./connectionState";
import {ConnectionStatePipe} from "./connectionState.pipe";

@Injectable()
export class SignalRService {
    @Output() stateChanged: EventEmitter<ConnectionState> = new EventEmitter();
    @Output() logEvent: EventEmitter<string> = new EventEmitter();
    private _hubConnection = $.hubConnection();
    constructor() {
        this._hubConnection.starting(() => {
            this._raiseLogEvent("[starting]");
        });
        this._hubConnection.connectionSlow(() => {
            this._raiseLogEvent("[connectionSlow]");
        });
        this._hubConnection.disconnected(() => {
            this._raiseLogEvent("[disconnected]");
        });
        this._hubConnection.reconnecting(() => {
            this._raiseLogEvent("[reconnecting]");
        });
        this._hubConnection.reconnected(() => {
            this._raiseLogEvent("[reconnected]");
        });
        this._hubConnection.stateChanged(change => {
            this._raiseStateChanged(change);
        });
        this._hubConnection.error(error => {
            this._raiseLogEvent("[error]", "error.message:", error.message);
        });
    }
    start() {
        this._hubConnection.start()
            .done(() => {
                this._raiseLogEvent("[start.done]");
            })
            .fail(reason => {
                this._raiseLogEvent("[start.fail]", "reason:", reason);
            });
    }
    stop() {
        this._hubConnection.stop();
    }
    private _raiseStateChanged(change: SignalRStateChange) {

        if (change.oldState !== undefined) {
            var oldStateName = ConnectionStatePipe.connectionStateToString(change.oldState);
            var newStateName = ConnectionStatePipe.connectionStateToString(change.newState);
            this._raiseLogEvent("[stateChanged]", "oldState:", oldStateName, "newState:", newStateName);
        }

        var connectionState = new ConnectionState(this._hubConnection);
        this.stateChanged.emit(connectionState);
    }
    private _raiseLogEvent(...args) {
        this.logEvent.emit(args.join(" "));
    }
}
