import {Injectable, EventEmitter, Output} from "angular2/core";
import {ConnectionState} from "./connectionState";

@Injectable()
export class SignalRService {
    @Output() stateChanged: EventEmitter<ConnectionState> = new EventEmitter();
    @Output() eventLogged: EventEmitter<string> = new EventEmitter();
    start() {
        console.log("SignalRService.start");
        this.stateChanged.emit(new ConnectionState(4));
    }
    stop() {
        console.log("SignalRService.stop");
    }
}
