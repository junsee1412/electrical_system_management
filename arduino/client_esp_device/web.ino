void homePage() {
  IPAddress ip = WiFi.softAPIP();
  String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
  if (st != "") {
    content = st;
  } else {
    if (WiFi.localIP()) {
    IPAddress ip = WiFi.localIP();
      ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
    }
    content = "{";
    content += "\"ip\" : \"";
    content += ipStr;
    content += "\",";
    content += "\"mac\" : \"";
    content += macstr;
    content += "\",";
    content += "\"state\" : ";
    content += state;
    content += ",";
    content += "\"type\" : \"";
    content += type;
    content += "\"";
    content += "}";
  }
  statusCode = 200;
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(statusCode, "application/json", content);
}

void clearPage() {
  //setupAP();
  for (int i = 0; i < 128; ++i) {
    EEPROM.write(i, 0);
  }
  EEPROM.commit();
 
  content = "{\"Success\":\"Clear... reset to boot into new wifi\"}";
  statusCode = 200;
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(statusCode, "application/json", content);
  delay(1000);
  ESP.reset();
  return;
}

void settingPage() {
  String qserver = server.arg("server");
  String qsid = server.arg("ssid");
  String qpass = server.arg("pass");
  if (qsid.length() > 0 && qpass.length() > 0) {
    Serial.println("clearing eeprom");
    for (int i = 0; i < 128; ++i) {
      EEPROM.write(i, 0);
    }
    Serial.println(qserver);
    Serial.println("");
    Serial.println(qsid);
    Serial.println("");
    Serial.println(qpass);
    Serial.println("");
 
    Serial.println("writing eeprom server:");
    for (int i = 0; i < qserver.length(); ++i)
    {
      EEPROM.write(i, qserver[i]);
      Serial.print("Wrote: ");
      Serial.println(qserver[i]);
    }
 
    Serial.println("writing eeprom ssid:");
    for (int i = 0; i < qsid.length(); ++i)
    {
      EEPROM.write(32 + i, qsid[i]);
      Serial.print("Wrote: ");
      Serial.println(qsid[i]);
    }
    Serial.println("writing eeprom pass:");
    for (int i = 0; i < qpass.length(); ++i)
    {
      EEPROM.write(64 + i, qpass[i]);
      Serial.print("Wrote: ");
      Serial.println(qpass[i]);
    }
    EEPROM.commit();
 
    content = "{\"Success\":\"saved to eeprom... reset to boot into new wifi\"}";
    statusCode = 200;
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(statusCode, "application/json", content);
    ESP.reset();
    return;
  } else {
    content = "{\"Error\":\"404 not found\"}";
    statusCode = 404;
    Serial.println("Sending 404");
  }
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(statusCode, "application/json", content);
}

void handle_led(){
  state = server.arg("state").toInt();
 
  digitalWrite(led2, state);
  server.send(200, "application/json", String("{\"state\": ") + state + String("}"));
}
