#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <WebSocketsClient.h>

WebSocketsClient webSocket;
 
//Variables
int i = 0;
int statusCode;
const char* ssid = "text";
const char* passphrase = "text";
String st;
String content;

const uint16_t port = 3000;
const char* path = "/ws";

// const int sw = 0;
const int led2 = 2;
int state = 0;
const char* type = "device";

String essv = "";
String esid = "";
String epass = "";
String macstr = "";

ESP8266WebServer server(80);
 
void setup()
{
  Serial.begin(9600);
  pinMode(led2, OUTPUT);

  WiFi.disconnect();
  Serial.println("Startup");
  readEEP();

  WiFi.begin(esid.c_str(), epass.c_str());
  macstr = WiFi.macAddress();
  
  if (testWifi())
  {
    Serial.println("Succesfully Connected!!!");
  }
  else
  {
    Serial.println("Turning the HotSpot On");
    setupAP();
  }

  server.on("/", homePage);
  server.on("/clear", clearPage);
  server.on("/setting", settingPage);
  server.begin();

  while ((WiFi.status() != WL_CONNECTED))
  {
    Serial.print(".");
    delay(100);
    server.handleClient();
  }
  
  Serial.println(macstr);

  webSocket.begin(essv, port, path, macstr);
  webSocket.onEvent(webSocketEvent);
}
void loop() {
  webSocket.loop();
//  static bool isPressed = false;
//  if (!isPressed && digitalRead(sw) == 0) {
//    isPressed = true;
//    String sent = macstr;
//    sent += " ";
//    sent += (state) ? "OFF" : "ON";
//    webSocket.sendTXT(sent);
//  } else if (isPressed && digitalRead(sw)) {
//    isPressed = false;
////    webSocket.sendTXT("BTN_RELEASE");
//  }
  server.handleClient();
}
