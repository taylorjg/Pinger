import {Injectable, EventEmitter, Output} from "angular2/core";
import {ConnectionState} from "./connectionState";

@Injectable()
export class SignalRService {
    @Output() stateChanged: EventEmitter<ConnectionState> = new EventEmitter();
    @Output() eventLogged: EventEmitter<string> = new EventEmitter();
    private hubConnection = $.hubConnection();
    start() {
        console.log("SignalRService.start");
        this.hubConnection.start(() => {
            console.log("hubConnection.start callback");
            this.stateChanged.emit(new ConnectionState(this.hubConnection.state));
        });
    }
    stop() {
        console.log("SignalRService.stop");
        this.hubConnection.stop();
    }
}
