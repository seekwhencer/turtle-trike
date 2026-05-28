void setup() {
    Serial.begin(115200);

    Serial.println("ESP32 READY");
}

void loop() {

    // Nachrichten vom Pi empfangen
    if (Serial.available()) {

        String cmd = Serial.readStringUntil('\n');

        cmd.trim();

        if (cmd == "PING") {
            Serial.println("PONG");
        }

        else if (cmd == "LED_ON") {
            digitalWrite(2, HIGH);
            Serial.println("OK");
        }

        else if (cmd == "LED_OFF") {
            digitalWrite(2, LOW);
            Serial.println("OK");
        }
    }

    // Beispiel: Sensorstatus zyklisch senden
    static unsigned long last = 0;

    if (millis() - last > 1000) {
        last = millis();

        Serial.println("TEMP:24.3");
    }
}