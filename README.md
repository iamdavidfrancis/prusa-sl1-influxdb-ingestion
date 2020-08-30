# prusa-sl1-influxdb-ingestion

A tool to subscribe to the Prusa SL1 status websocket and send that data into InfluxDb. 

Feel free to open an issue or PR if you find any problems.

# Usage

You need to already have an influxdb instance running with a database made.

Pull the image with:
```
docker pull iamdavidfrancis/prusa-sl1-influxdb-ingestion
```

The image requires several environment variables to work:

`PRINTER_HOST`: The IP address or hostname of the Prusa Sl1 printer.   
`INFLUX_HOST`: The IP address or hostname of the InfluxDb Instance   
`INFLUX_DATABASE`: The name of the database to send the data.   
`INFLUX_USER`: The username for the influxdb instance.   
`INFLUX_PASSWORD`: The password for the influxdb user.

# Known Issues

Something fails when the print finishes and the docker container needs to be restarted when you start the next print. I'm looking into what's going on now.


# TODO
* Add Influx port to environment variables.
* Add UTs
* Fix errors when print finishes
