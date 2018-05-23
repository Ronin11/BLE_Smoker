#include <Time.h>
#include <TimeLib.h>

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
BLECharacteristic timeCharacteristic = BLECharacteristic(0x0013);
 
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

  //Setup all the bluetooth things
  smokerService.begin();
  tempCharacteristic.setProperties(CHR_PROPS_NOTIFY);
  tempCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  tempCharacteristic.setFixedLen(2);
  tempCharacteristic.begin();
  timeCharacteristic.setProperties(CHR_PROPS_WRITE);
  timeCharacteristic.setPermission(SECMODE_OPEN, SECMODE_OPEN);
  timeCharacteristic.setWriteCallback(timeWriteEvent);
  timeCharacteristic.setFixedLen(4);
  timeCharacteristic.begin();
  

  // Set up and start advertising
  startAdv();
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

union ArrayToInteger {
  byte array[4];
  uint32_t integer;
};

void timeWriteEvent(BLECharacteristic& chr, uint8_t* data, uint16_t len, uint16_t offset){
  if(len != 4){
    return;
  }
  ArrayToInteger converter = {data[0],data[1],data[2],data[3]}; //Create a converter
  uint32_t timeSeed = converter.integer; //Read the 32bit integer value.
  setTime(timeSeed);
}

void loop(void)
{ 
  int timeSet = timeStatus();
  if(timeSet){
    Serial.print("Time now is: ");
    Serial.print(hour());
    Serial.print(":");
    Serial.print(minute());
    Serial.print(":");
    Serial.print(second());
    Serial.print("\n");
  }

  // call sensors.requestTemperatures() to issue a global temperature 
  // request to all devices on the bus
  if(Bluefruit.connected()){
    sensors.requestTemperatures(); // Send the command to get temperatures
    uint16_t temp = sensors.getTempCByIndex(0) * 10; //* 10 so we send the first decimal
    uint8_t arr[2];
    arr[0]=(temp >> 8);
    arr[1]=temp & 0xff;
    tempCharacteristic.notify(arr, 2);
  }
  delay(500);
}



