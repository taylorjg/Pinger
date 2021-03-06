﻿import {ConnectionStateFlags} from "./connectionStateFlags";

export class ConnectionState {
    newState: number;
    newStateFlags: ConnectionStateFlags;
    transportName: string;
    constructor(private hubConnection: HubConnection) {
        this.newState = hubConnection.state;
        this.newStateFlags = new ConnectionStateFlags(this.newState);
        this.transportName = (hubConnection.transport && hubConnection.transport.name) ? hubConnection.transport.name : "";
    }
}
