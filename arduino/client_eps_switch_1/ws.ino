void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED:
        Serial.printf("[WSc] Connected to url: %s\n", payload);
      break;
    case WStype_TEXT:
      Serial.printf("[WSc] get text: %s\n", payload);
      if (strcmp((char*)payload, "ON") == 0) 
      {
        state = 1;
        digitalWrite(led2, state);
      } 
      else if (strcmp((char*)payload, "OFF") == 0) 
      {
        state = 0;
        digitalWrite(led2, state);
      }
      break;
    case WStype_BIN:
      Serial.printf("[WSc] get binary length: %u\n", length);
      break;
  }
}