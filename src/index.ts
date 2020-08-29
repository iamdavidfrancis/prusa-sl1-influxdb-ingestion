import WebsocketConnection from './webclient';
import InfluxClient from './influx-client';

class Main {
    constructor() {
        const url = process.env.PRINTER_HOST;

        if (!url) {
            console.error('Printer Host missing');
            return;
        }

        const connection = new WebsocketConnection();

        const influxClient = new InfluxClient(url);
        
        connection.initialize(url, influxClient);
    }
}

const app = new Main();