```bash
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

sudo mv bin/arduino-cli /usr/local/bin/
rmdir bin

arduino-cli config init
arduino-cli config add board_manager.additional_urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json


arduino-cli core update-index
arduino-cli core install esp32:esp32

arduino-cli lib install "ArduinoJson"
```

```bash
cd esp32

arduino-cli compile --fqbn esp32:esp32:esp32 test/
arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 test/

# oder
arduino-cli compile --fqbn esp32:esp32:esp32 -p /dev/ttyUSB0 -u test/
```

```bash
arduino-cli lib search "DHT sensor"
```