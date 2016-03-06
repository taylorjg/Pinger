import {Pipe, PipeTransform} from "angular2/core";

@Pipe({
    name: "connectionStateToString"
})
export class ConnectionStatePipe implements PipeTransform {
    transform(value: any, args: any[]): any {
        return ConnectionStatePipe.connectionStateToString(value);
    }
    static connectionStateToString(value: any): string {
        switch (value) {
            case 0: return "Connecting";
            case 1: return "Connected";
            case 2: return "Reconnecting";
            case 4: return "Disconnected";
            default: return "?";
        }
    }
}
