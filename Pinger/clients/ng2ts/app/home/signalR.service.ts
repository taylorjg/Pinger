// ReSharper disable InconsistentNaming

import {Injectable, EventEmitter, Output} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import {ConnectionState} from "./connectionState";
import {ConnectionStatePipe} from "./connectionState.pipe";

@Injectable()
export class SignalRService {
    @Output() stateChanged$: Observable<ConnectionState>;
    @Output() logEvent$: Observable<string>;
    private _hubConnection = $.hubConnection();
    constructor() {
        var initialConnectionState = new ConnectionState(this._hubConnection);
        this.stateChanged$ = new BehaviorSubject(initialConnectionState);
        this.logEvent$ = new Subject();
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

        var oldStateName = ConnectionStatePipe.connectionStateToString(change.oldState);
        var newStateName = ConnectionStatePipe.connectionStateToString(change.newState);
        this._raiseLogEvent("[stateChanged]", "oldState:", oldStateName, "newState:", newStateName);

        var connectionState = new ConnectionState(this._hubConnection);
        (<Observer<ConnectionState>>this.stateChanged$).next(connectionState);
    }
    private _raiseLogEvent(...args) {
        var message = args.join(" ");
        (<Observer<string>>this.logEvent$).next(message);
    }
}
