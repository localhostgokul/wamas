#include "HX711.h"

HX711 scale;

// HX711 config
uint8_t dataPin = 4;   // GPIO4 D2 // Change if needed
uint8_t clockPin = 5;  // GPIO5 D1 // Change if needed

float calibration_factor = 369.126740; // Calibration need for every device

void setup() {

  Serial.begin(115200);
  scale.begin(dataPin, clockPin);
  scale.set_scale(calibration_factor);
  scale.tare();

  Serial.println("HX711 Ready...");
}

void loop() {

  if (scale.is_ready()) {
    
    float weight_grams = scale.get_units(10);  // average 10 readings
    float weight_kg = weight_grams / 1000.0;

    Serial.print("Weight: ");
    Serial.print(weight_grams, 2);
    Serial.print(" g  |  ");
    Serial.print(weight_kg, 3);
    Serial.println(" kg");

  } else {
    Serial.println("HX711 not found.");
  }

  delay(1000);
}