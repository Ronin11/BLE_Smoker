#include <Time.h>
#include <TimeLib.h>
#include <bluefruit.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 2


//BLEUart bleuart;
 
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
 
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);
DeviceAddress addr;

//Service Declarations
BLEService smokerService = BLEService(0x0011);
BLECharacteristic tempCharacteristic = BLECharacteristic(0x0012);
 
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
  Bluefruit.autoConnLed(true);
  
  // Configure and start the BLE Uart service
//  bleuart.begin();
  smokerService.begin();
  tempCharacteristic.setProperties(CHR_PROPS_NOTIFY);
  tempCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  tempCharacteristic.setFixedLen(2);
  tempCharacteristic.setCccdWriteCallback(cccd_callback);  // Optionally capture CCCD updates
  tempCharacteristic.begin();

  // Set up and start advertising
  startAdv();

  //Setup commands
//  setupCommands();


}

void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  
  // Include the BLE UART (AKA 'NUS') 128-bit UUID
//  Bluefruit.Advertising.addService(bleuart);
  Bluefruit.Advertising.addService(smokerService);

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

void cccd_callback(BLECharacteristic& chr, uint16_t cccd_value)
{
    // Display the raw request packet
    Serial.print("CCCD Updated: ");
    //Serial.printBuffer(request->data, request->len);
    Serial.print(cccd_value);
    Serial.println("");
 
    // Check the characteristic this CCCD update is associated with in case
    // this handler is used for multiple CCCD records.
    if (chr.uuid == tempCharacteristic.uuid) {
        if (chr.notifyEnabled()) {
            Serial.println("Heart Rate Measurement 'Notify' enabled");
        } else {
            Serial.println("Heart Rate Measurement 'Notify' disabled");
        }
    }
}
 
void loop(void)
{ 

  // call sensors.requestTemperatures() to issue a global temperature 
  // request to all devices on the bus
  if(Bluefruit.connected()){
    sensors.requestTemperatures(); // Send the command to get temperatures
    float temp = sensors.getTempCByIndex(0) ;
    uint16_t farenheit = (temp * 9 / 5 + 32);
    uint8_t arr[2];
    arr[0]=(farenheit >> 8);
    arr[1]=farenheit & 0xff;
    tempCharacteristic.notify(arr, 2);
  }
  delay(500);
}



