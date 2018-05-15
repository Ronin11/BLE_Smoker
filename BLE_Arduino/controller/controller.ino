#include <Time.h>
#include <TimeLib.h>
#include <bluefruit.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 2


BLEUart bleuart;
 
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
 
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);
DeviceAddress addr;

// Function prototypes for packetparser.cpp
uint8_t readPacket (BLEUart *ble_uart, uint16_t timeout);
float   parsefloat (uint8_t *buffer);
void    printHex   (const uint8_t * data, const uint32_t numBytes);

// Packet buffer
extern uint8_t packetbuffer[];
bool isBleConnected = false;
 
void setup(void)
{
  // start serial port
  Serial.begin(115200);
  Serial.println(F("System start"));
  Serial.println(F("-------------------------------------------"));
 
  // Start up the sensor library
  sensors.begin();

  // Start up the BLE
  Bluefruit.begin();
  // Set max power. Accepted values are: -40, -30, -20, -16, -12, -8, -4, 0, 4
  Bluefruit.setTxPower(4);
  Bluefruit.setName("Super Awesome BLE");

  // Configure and start the BLE Uart service
  bleuart.begin();

  // Set up and start advertising
  startAdv();
}

void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  
  // Include the BLE UART (AKA 'NUS') 128-bit UUID
  Bluefruit.Advertising.addService(bleuart);

  // Secondary Scan Response packet (optional)
  // Since there is no room for 'Name' in Advertising packet
  Bluefruit.ScanResponse.addName();

  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   * - Start(timeout) with timeout = 0 will advertise forever (until connected)
   * 
   * For recommended advertising interval
   * https://developer.apple.com/library/content/qa/qa1931/_index.html   
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
}

 
void loop(void)
{  

  //On connect we will request the time from the device to set the internal clock
  if(Bluefruit.connected() && !isBleConnected){
    isBleConnected = true;
    Serial.println(timeStatus() == timeNotSet);
  }else{
    isBleConnected = Bluefruit.connected();
  }
     
  // call sensors.requestTemperatures() to issue a global temperature 
  // request to all devices on the bus
  sensors.requestTemperatures(); // Send the command to get temperatures
  uint16_t temp = sensors.getTempCByIndex(0);
  uint16_t farenheit = temp * 9 / 5 + 32;

  
  /* BLUETOOTH */
  // Wait for new data to arrive
  uint8_t len = readPacket(&bleuart, 500);
  if (len == 0) return;
  
  // Got a packet!
   if(packetbuffer[1] == 'a'){
    char cstr[8];
    sprintf(cstr, "%03i", farenheit);
    bleuart.write(cstr, 8);
     digitalWrite(LED_BUILTIN, HIGH);
   }else if(packetbuffer[1] == 's'){
     digitalWrite(LED_BUILTIN, LOW);
   }
}



