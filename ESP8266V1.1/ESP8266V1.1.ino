#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "HX711.h"

// Wi-Fi Config
const char* ssid = "Warzone";
const char* password = "Warzone0";
const char* serverName = "http://192.168.1.6:5000/trashdata/";

// HX711 config
uint8_t dataPin = 4;   // GPIO4 D2 // Change if needed
uint8_t clockPin = 5;  // GPIO5 D1 // Change if needed

// float calibration_factor = -415.767517; // previous calibration factor
float calibration_factor = 369.126740; // For 795gms
// float calibration_factor = -128.800003; // For 200gms

float weight;
float maxCapacity = 10.0; // For weight level calculation // Change if needed
float percentage;
bool isFull = false;
HX711 scale;

// GPS Latitute and Longitute
float latitude  = 12.345678;
float longitude = 98.765432;

// Device address
String Devi = "6F";

unsigned long previousMillis = 0;
const unsigned long interval = 60000;  // 1 minute

void setup() {

  Serial.begin(115200);
  scale.begin(dataPin, clockPin);

  // ---- WiFi ----
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // ---- HX711 ----
  scale.set_scale(calibration_factor); // Calibration need for every device
  scale.tare();
  long zero_factor = scale.read_average();
  Serial.println("HX711 Ready");
}

void loop(){

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    weightCalculation();
    sendAPI();
  }

  // For weight change significantly
  // static float lastWeight = 0;
  
  // if (currentMillis - previousMillis >= interval) {
  //   previousMillis = currentMillis;
    
  //   weightCalculation();
    
  //   if (abs(weight - lastWeight) > 0.1) {
  //     sendAPI();
  //     lastWeight = weight;
  //   }
  // }

}

void weightCalculation(){
  
  if (!scale.is_ready()) {
  Serial.println("HX711 not ready");
  return;
  }

  float weightGrams = scale.get_units(5);
  weight = round((weightGrams / 1000.0) * 100) / 100.0;
  Serial.print("weight: ");
  Serial.println(weight);
  // weight = scale.get_units(5);
  percentage = (weight / maxCapacity) * 100;

  // Limit percentage to 100%
  percentage = (weight / maxCapacity) * 100;
  percentage = constrain(percentage, 0, 100);

  // Check if full or not
  isFull = (percentage >= 80);
}

void sendAPI(){

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected");
    return;
  }

  WiFiClient client;
  HTTPClient http;

  String path = serverName + Devi;

  

  http.begin(client, path);
  http.addHeader("Content-Type", "application/json");
  
  String json;
  json.reserve(300);   // increase a little because JSON is bigger

  json = "{";

  json += "\"tempat_sampah_maxcapacity\": " + String(maxCapacity, 2) + ",";

  json += "\"tempat_sampah_current\": {";
  json += "\"tempat_sampah_gpslocation\": {\"lon\": " + String(longitude, 6) + ", \"lat\": " + String(latitude, 6) + "},";
  json += "\"tempat_sampah_currentcapacity\": " + String(weight, 2) + ",";
  json += "\"tempat_sampah_currentlevel\": " + String(percentage, 2);
  json += "},";

  json += "\"tempat_sampah_isfull\": " + String(isFull ? "true" : "false");

  json += "}";

  Serial.println("Sending JSON:");
  Serial.println(json);

  int httpResponseCode = http.PUT(json);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode > 0) {
    Serial.println(http.getString());
  }

  http.end();
}