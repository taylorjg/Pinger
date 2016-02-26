import {Injectable, EventEmitter, Output} from "angular2/core";

@Injectable()
export class SignalRService {
    @Output() thing: EventEmitter<string> = new EventEmitter();
    start() {
        console.log("SignalRService.start");
        this.thing.emit("blah");
    }
    stop() {
        console.log("SignalRService.stop");
    }
}
