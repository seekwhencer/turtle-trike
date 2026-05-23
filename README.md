# turtle trike

Whatever. Work in Progress.

Setup for a Raspberry Pi 4 with

- Docker
- Portainer
- Mosquitto
- MediaMTX
- nginx Reverse Proxy

And my own server app with a CSR frontend app.

## Server
act as

- MQTT client
- Post Processor to publish a calculation result from other topics on a new topic
- API Server
- Websocket Server

### Post Processor
Can be configured with json files. For example:

```json
[
    {
        "topic": "turtle/system/cpu",
        "enable": true,
        "debug": false,
        "label": "CPU Usage",
        "calculator": "average",
        "debounce": 50,
        "source": {
            "one": "turtle/system/cpu/1",
            "two": "turtle/system/cpu/2",
            "three": "turtle/system/cpu/3",
            "four": "turtle/system/cpu/4"
        }
    },
    {
        "topic": "turtle/system/cpu/1",
        "enable": true,
        "debug": false,
        "label": "CPU 1 Usage",
        "calculator": "cpu",
        "core": 1,
        "pulse": 500
    }
    ...
]
```

This are two configurations. 
- `topic` is the new publishing target  
- `calculator` equals the export name in `lib/Mqtt/Calculators/index.js`  
- `debounce` in ms
- `source`can be 
  - an **array of topics**, 
  - an **object** where the key is a name and the value is a source topic 
  - or a **single topic as string**
- `pulse` means: ms to reapeat the calculation and publish it
- something like `core` is an individual property for this topic calculator

### Available Calculators
- average
- dewpoint
- webulb
- wetbulbhuman
- absolutehumidity
- maptopic
- maptopicfromjson
- moistairvolume
- moistairdensity
- maximum
- minimum
- cpu
- ram
- throttle

To understand:

- a value from a topic is set only when it is received. It is never set internally.
- a calculator publishes its result to its topic.
- a calculator can be deaf to source topics, while a post-processing task can still publish the value.
- restart the server to load the new topic JSON configurations.
  

### Why turle trike?

The idea: build a small drivable trike with bike battery, raspberry pi, gear motors and drivers, esp32, gamepad, infrared ip camera and strong wifi (external). Tthis repo is the raspberry pi device setup.

### What's missing at the moment?

- Wifi Accesspoint on the internal wifi for the ESP's (hostapd)
- The gamepad control via browser in the frontend app
- On screen controls
- Head up display (HUD)
- Recording
- External SSD

### Goal
Just interact with the device with a browser.

![Screenshot First Setup](https://raw.githubusercontent.com/seekwhencer/turtle-trike/refs/heads/master/docs/screenshots/screenshot00.png?raw=true "Screenshot  First Setup")