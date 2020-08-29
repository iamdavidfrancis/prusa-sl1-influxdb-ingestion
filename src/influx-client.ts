import * as Influx from 'influx';

export interface InfluxEntrySchema {
    blower_fan: number,
    cover_closed: boolean,
    current_layer: number,
    progress: number, // Percent complete
    project_name: string,
    rear_fan: number,
    resin_remaining_ml: number,
    resin_used_ml: number,
    temp_amb: number,
    temp_cpu: number,
    temp_led: number,
    time_elapsed_min: number,
    time_remain_min: number,
    total_layers: number,
    uv_led_fan: number
}

export default class InfluxClient {
    private measurement =  'printStats';
    private influx: Influx.InfluxDB;
    
    constructor(private printerHost: string) {
        if (!process.env.INFLUX_HOST) {
            throw "Missing InfluxDb Host";
        }

        const config: Influx.ISingleHostConfig = {
            host: process.env.INFLUX_HOST,
            database: process.env.INFLUX_DATABASE,
            username: process.env.INFLUX_USER,
            password: process.env.INFLUX_PASSWORD,
            schema: [
                {
                    measurement: this.measurement,
                    fields: {
                        blower_fan: Influx.FieldType.INTEGER,
                        cover_closed: Influx.FieldType.BOOLEAN,
                        current_layer: Influx.FieldType.INTEGER,
                        progress: Influx.FieldType.INTEGER, // Percent complete
                        project_name: Influx.FieldType.STRING,
                        rear_fan: Influx.FieldType.INTEGER,
                        resin_remaining_ml: Influx.FieldType.INTEGER,
                        resin_used_ml: Influx.FieldType.FLOAT,
                        temp_amb: Influx.FieldType.FLOAT,
                        temp_cpu: Influx.FieldType.INTEGER,
                        temp_led: Influx.FieldType.FLOAT,
                        time_elapsed_min: Influx.FieldType.INTEGER,
                        time_remain_min: Influx.FieldType.INTEGER,
                        total_layers: Influx.FieldType.INTEGER,
                        uv_led_fan: Influx.FieldType.INTEGER
                    },
                    tags: [
                        'host'
                    ]
                }
            ]
        };
    
        this.influx = new Influx.InfluxDB(config);
    }

    public addDbEntry = async (item: InfluxEntrySchema & { exposure: number }): Promise<void> => {
        if (!this.influx) {
            throw "DB not Initialized";
        }

        if (item.exposure) {
            return;
        }

        await this.influx.writePoints([
            {
                measurement: this.measurement,
                tags: { host: this.printerHost },
                fields: item as any,
                timestamp: new Date()
            }
        ]);

        console.log("Data written to influx");
    }
}
