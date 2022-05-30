void readEEP() {
    EEPROM.begin(512);
    delay(10);

    Serial.println("Reading EEPROM server");
    for (int i = 0; i < 32; ++i)
    {
        essv += char(EEPROM.read(i));
    }
    Serial.println();
    Serial.print("server: ");
    Serial.println(essv);

    Serial.println("Reading EEPROM SSID");
    for (int i = 32; i < 64; ++i)
    {
        esid += char(EEPROM.read(i));
    }
    Serial.println();
    Serial.print("SSID: ");
    Serial.println(esid);
    
    Serial.println("Reading EEPROM pass");
    for (int i = 64; i < 128; ++i)
    {
        epass += char(EEPROM.read(i));
    }
    Serial.print("PASS: ");
    Serial.println(epass);
}

bool testWifi(void)
{
  int c = 0;
  Serial.println("Waiting for Wifi to connect");
  while ( c < 20 ) 
  {
    if (WiFi.status() == WL_CONNECTED)
    {
      return true;
    }
    delay(500);
    Serial.print("*");
    c++;
  }
  Serial.println("");
  Serial.println("Connect timed out, opening AP");
  return false;
}

void setupAP(void)
{
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else
  {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i)
    {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  st = "[";
  for (int i = 0; i < n; ++i)
  {
    // Print SSID and RSSI for each network found
    st += "{";
    st += "\"SSID\" : ";
    st += "\"";
    st += WiFi.SSID(i);
    st += "\",";

    st += "\"RSSI\" : ";
    st += "\"";
    st += WiFi.RSSI(i);
    st += "\",";

    st += "\"Encryp\" : ";
    st += "\"";
    st += (WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*";
    st += "\"";
    st += "}";
    st += (i<n-1) ? "," : "";
  }
  st += "]";
  Serial.println(st);
  delay(100);
  WiFi.softAP("DT_Device_" + macstr, "");
}
