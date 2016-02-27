import {ConnectionStateFlags} from "./connectionStateFlags";

export class ConnectionState {
    newStateFlags: ConnectionStateFlags;
    constructor(public newState: number, public transportName: string = "") {
        this.newStateFlags = new ConnectionStateFlags(this.newState);
    }
}
