import WebsocketConnection from './webclient';
import InfluxClient from './influx-client';

class Main {
    constructor() {
    }

    public async start() {
        const url = process.env.PRINTER_HOST;

        if (!url) {
            console.error('Printer Host missing');
            return;
        }

        const connection = new WebsocketConnection();

        const influxClient = new InfluxClient(url);
        
        await this.loop(() => connection.initialize(url, influxClient));
    } 

    private async loop(func: () => Promise<void>) {
        const delay = (milliseconds) => {
            return new Promise(res => {
                setTimeout(res, milliseconds);
            })
        }
        
        const maxBackoff = 10 * 60 * 1000; // 10 min
        let backoff = 100; 

        while(true) {
            try {
                await func();
                backoff = 100;
            } catch (err) {
                console.error(err);

                // Every time we fail, back off a little longer.
                // Delay amount resets on a success. (AKA connection succeeded then closed.)
                await delay(Math.min(backoff, maxBackoff));
                backoff *= 2;
            }
            
        }
    }
}

const app = new Main();
app.start()
    .then(() => console.log("Main start method ended. Weird."))
    .catch((err) => console.error(`Main start method ended with an error: ${JSON.stringify(err, null, '\t')}`))