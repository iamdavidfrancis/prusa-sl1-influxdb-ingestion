import Websocket from 'websocket';
import InfluxClient from './influx-client';

interface MessageData {
    type: string;
    content?: any;
}

export default class WebsocketConnection {
    private client: Websocket.client;

    constructor() {
        this.client = new Websocket.client();
    }

    public async initialize(printerIP: string, influxClient: InfluxClient): Promise<void> {
        return new Promise((res, rej) => {
            this.client.on('connectFailed', (error) => {
                console.error(`Connection failed: ${JSON.stringify(error, null, '\t')}`);
                rej(error); 
            });

            this.client.on('connect', (connection) => {
                console.log('Connection successful.');

                connection.on('error', (error) => {
                    console.error(`Connection Error: ${JSON.stringify(error, null, '\t')}`);
                });

                connection.on('close', () => {
                    console.log('Connection closed.');
                    res();
                });

                connection.on('message', async (message) => {
                    if (message.type === 'utf8') {
                        const data = JSON.parse(message.utf8Data || '') as MessageData;

                        if (data.type === "items") {
                           if (!data.content || data.content.exposure) {
                               return;
                           } else {
                               await influxClient.addDbEntry(data.content);
                           }
                        }
                    }
                });
            });

            console.log("Connecting...");
            this.client.connect(`ws://${printerIP}/ws`);
        });
    }
}