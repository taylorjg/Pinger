// ReSharper disable InconsistentNaming

import {Injectable, Output} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import {ConnectionState} from "./connectionState";
import {ConnectionStatePipe} from "./connectionState.pipe";

type ClientMethodTuple = [string, string, Subject<any[]>, (...args: any[]) => void];

@Injectable()
export class SignalRService {
    @Output() stateChanged$: Observable<ConnectionState>;
    @Output() logEvent$: Observable<string>;
    private _hubConnection = $.hubConnection();
    private _hubProxyDictionary = {};
    private _clientMethodSubjects: ClientMethodTuple[] = [];
    constructor() {
        var initialConnectionState = new ConnectionState(this._hubConnection);
        this.stateChanged$ = new BehaviorSubject(initialConnectionState);
        this.logEvent$ = new Subject<string>();
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
    registerClientMethodListener(hubName: string, methodName: string): Observable<any[]> {
        return this._getClientMethodSubject(hubName, methodName);
    }
    private _raiseStateChanged(change: SignalRStateChange) {
        var oldStateName = ConnectionStatePipe.connectionStateToString(change.oldState);
        var newStateName = ConnectionStatePipe.connectionStateToString(change.newState);
        this._raiseLogEvent("[stateChanged]", "oldState:", oldStateName, "newState:", newStateName);
        var connectionState = new ConnectionState(this._hubConnection);
        (<Subject<ConnectionState>>this.stateChanged$).next(connectionState);
    }
    private _raiseLogEvent(...args) {
        var message = args.join(" ");
        (<Subject<string>>this.logEvent$).next(message);
    }
    private _getClientMethodSubject(hubName: string, methodName: string): Subject<any[]> {
        var index = this._lookupClientMethodSubject(hubName, methodName);
        if (index >= 0) return this._clientMethodSubjects[index][2];
        return this._addClientMethodSubject(hubName, methodName);
    }
    private _lookupClientMethodSubject(hubName: string, methodName: string): number {
        var result = -1;
        this._clientMethodSubjects.forEach((t, i) => {
            var [hn, mn, _] = t;
            if (hn === hubName && mn === methodName) {
                result = i;
            }
        });
        return result;
    }
    private _addClientMethodSubject(hubName: string, methodName: string): Subject<any[]> {
        var subject = new Subject<any[]>();
        var hubProxy = this._getHubProxy(hubName);
        var callback = (...msg: any[]) => {
            subject.next(msg);
        };
        hubProxy.on(methodName, callback);
        this._clientMethodSubjects.push(<ClientMethodTuple>[hubName, methodName, subject, callback]);
        return subject;
    }
    private _removeClientMethodSubject(hubName: string, methodName: string): void {
        var index = this._lookupClientMethodSubject(hubName, methodName);
        if (index < 0) return;
        var [_, __, s, cb] = this._clientMethodSubjects[index];
        if (s.observers.length === 0) {
            var hubProxy = this._getHubProxy(hubName);
            hubProxy.off(methodName, cb);
            this._clientMethodSubjects.splice(index, 1);
            // Do we need call s.dispose() too ?
        }
    }
    private _getHubProxy(hubName: string): HubProxy {
        var hubProxy = this._hubProxyDictionary[hubName];
        if (!hubProxy) {
            hubProxy = this._hubConnection.createHubProxy(hubName);
            this._hubProxyDictionary[hubName] = hubProxy;
        }
        return hubProxy;
    }
}
