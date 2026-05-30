#include <ArduinoJson.h>

// Pins angepasst für ESP32 (Bitte prüfen, ob diese GPIOs frei/genutzt sind!)
int RPWMright = 5;
int LPWMright = 4;
int RPWMleft = 0;
int LPWMleft = 2;

// ESP32 Standard-Auflösung für analogWrite ist 255 (8-Bit)
int maxPWM = 255; 

// Prototyp der Funktion vorab deklarieren
int setSpeed(int speed, String side);
void deviceReady();

void setup() {
  // Startet die serielle Kommunikation über USB zum Raspberry Pi
  Serial.begin(115200); 
  while (!Serial) {
    ; // Warten bis Verbindung steht
  }

  // Motor-Treiber Pins konfigurieren
  pinMode(RPWMleft, OUTPUT);
  pinMode(LPWMleft, OUTPUT);
  pinMode(RPWMright, OUTPUT);
  pinMode(LPWMright, OUTPUT);

  digitalWrite(RPWMleft, LOW);
  digitalWrite(LPWMleft, LOW);
  digitalWrite(RPWMright, LOW);
  digitalWrite(LPWMright, LOW);

  setSpeed(0, "left");
  setSpeed(0, "right");

  // Kurzer Initialisierungstest der Motoren
  deviceReady();
  
  Serial.println("{\"status\":\"ready\"}");
}

void loop() {
  // Prüfen, ob Daten vom Raspberry Pi über USB reinkommen
  if (Serial.available() > 0) {
    
    // Erstellt ein JSON-Dokument
    DynamicJsonDocument json(512); // Reicht für die paar Werte locker aus
    
    // Liest den seriellen Puffer bis zum Zeilenumbruch und parst das JSON
    DeserializationError error = deserializeJson(json, Serial);

    if (!error) {
      // Überprüfen, ob das "throttle" Attribut existiert
      if (json.containsKey("throttle")) {
        int leftValue = json["left"];
        int rightValue = json["right"];

        // Geschwindigkeit für die Motoren setzen
        setSpeed(leftValue, "left");
        setSpeed(rightValue, "right");
        
        // Optionales Feedback an den Pi senden
        Serial.println("{\"status\":\"ack\"}");
      }
    } else {
      // Optional: Fehler ausgeben, falls das JSON defekt war
      // Serial.print("{\"error\":\""); Serial.print(error.c_str()); Serial.println("\"}");
    }
  }
}

/**
   Erwartet einen Wert zwischen -100 und 100
*/
int setSpeed(int speed, String side) {
  int pwm = 0;
  int LPWM;
  int RPWM;

  if (side == "left") {
    LPWM = LPWMleft;
    RPWM = RPWMleft;
  } else {
    LPWM = LPWMright;
    RPWM = RPWMright;
  }

  // Motor stoppen
  if (speed == 0) {
    analogWrite(LPWM, 0);
    analogWrite(RPWM, 0);
    return 0;
  }
  
  // Vorwärts
  if (speed > 0) {
    pwm = (maxPWM * speed) / 100;
    analogWrite(LPWM, pwm);
    analogWrite(RPWM, 0);
  }
  // Rückwärts
  else if (speed < 0) {
    pwm = (maxPWM * (speed * -1)) / 100;
    analogWrite(LPWM, 0);
    analogWrite(RPWM, pwm);
  }
  
  return pwm;
}

void deviceReady() {
  setSpeed(25, "left");  delay(200);
  setSpeed(50, "left");  delay(200);
  setSpeed(100, "left");  delay(200);
  setSpeed(-100, "left");  delay(200);
  setSpeed(0, "left");

  setSpeed(25, "right"); delay(200);  
  setSpeed(50, "right"); delay(200);
  setSpeed(100, "right"); delay(200);
  setSpeed(-100, "right"); delay(200);
  setSpeed(0, "right");  delay(200);
  
  setSpeed(-50, "right");
  setSpeed(-50, "left");
  delay(1000);

  setSpeed(0, "right");
  setSpeed(0, "left");
}