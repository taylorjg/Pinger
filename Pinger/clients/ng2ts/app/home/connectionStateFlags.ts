// ReSharper disable InconsistentNaming

export class ConnectionStateFlags {

    constructor(public connectionState: number) {
    }

    // signalR.connectionState = {
    //     connecting: 0,
    //     connected: 1,
    //     reconnecting: 2,
    //     disconnected: 4
    // };

    isConnecting = this.connectionState === 0;
    isConnected = this.connectionState === 1;
    isReconnecting = this.connectionState === 2;
    isDisconnected = this.connectionState === 4;
    isUnknown =
    !this.isConnecting &&
    !this.isConnected &&
    !this.isReconnecting &&
    !this.isDisconnected;
}
