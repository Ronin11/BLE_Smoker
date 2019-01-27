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
BLECharacteristic readTargetTempCharacteristic = BLECharacteristic(0x0014);
BLECharacteristic writeTargetTempCharacteristic = BLECharacteristic(0x0015);
BLECharacteristic readStartTimeCharacteristic = BLECharacteristic(0x0016);
BLECharacteristic writeStartTimeCharacteristic = BLECharacteristic(0x0017);
BLECharacteristic readEndTimeCharacteristic = BLECharacteristic(0x0018);
BLECharacteristic writeEndTimeCharacteristic = BLECharacteristic(0x0019);
BLECharacteristic writeFanSpeedCharacteristic = BLECharacteristic(0x0020);

int BLUE_LED = 3;
int RED_LED = 4;
int FAN = 29;
float targetTemp = 0;
uint32_t startTime = 0;
uint32_t endTime = 0;
uint8_t fanSpeed = 0;

#define FAN_MIN_SPEED 30
#define FAN_MAX_SPEED 100


 
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
  Bluefruit.setName("Smart Smoker");
  Bluefruit.autoConnLed(true);

  //Setup all the bluetooth things
  smokerService.begin();
  
  tempCharacteristic.setProperties(CHR_PROPS_NOTIFY);
  tempCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  tempCharacteristic.setFixedLen(2);
  tempCharacteristic.begin();
  
  timeCharacteristic.setProperties(CHR_PROPS_WRITE);
  timeCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
  timeCharacteristic.setWriteCallback(timeWriteEvent);
  timeCharacteristic.setFixedLen(4);
  timeCharacteristic.begin();

  readTargetTempCharacteristic.setProperties(CHR_PROPS_READ);
  readTargetTempCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  readTargetTempCharacteristic.begin();
  
  writeTargetTempCharacteristic.setProperties(CHR_PROPS_WRITE);
  writeTargetTempCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
  writeTargetTempCharacteristic.setWriteCallback(targetTempWriteEvent);
  writeTargetTempCharacteristic.setFixedLen(2);
  writeTargetTempCharacteristic.begin();

  readStartTimeCharacteristic.setProperties(CHR_PROPS_READ);
  readStartTimeCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  readStartTimeCharacteristic.begin();
  
  writeStartTimeCharacteristic.setProperties(CHR_PROPS_WRITE);
  writeStartTimeCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
  writeStartTimeCharacteristic.setWriteCallback(startTimeWriteEvent);
  writeStartTimeCharacteristic.setFixedLen(4);
  writeStartTimeCharacteristic.begin();

  readEndTimeCharacteristic.setProperties(CHR_PROPS_READ);
  readEndTimeCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  readEndTimeCharacteristic.begin();
  
  writeEndTimeCharacteristic.setProperties(CHR_PROPS_WRITE);
  writeEndTimeCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
  writeEndTimeCharacteristic.setWriteCallback(endTimeWriteEvent);
  writeEndTimeCharacteristic.setFixedLen(4);
  writeEndTimeCharacteristic.begin();

  writeFanSpeedCharacteristic.setProperties(CHR_PROPS_WRITE);
  writeFanSpeedCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
  writeFanSpeedCharacteristic.setWriteCallback(startFanWriteEvent);
  writeFanSpeedCharacteristic.setFixedLen(1);
  writeFanSpeedCharacteristic.begin();

  // Set up and start advertising
  startAdv();
  pinMode(BLUE_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(FAN, OUTPUT);
  digitalWrite(BLUE_LED, LOW);
  digitalWrite(RED_LED, LOW);
  digitalWrite(FAN, LOW);
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

union arrayToUint32 {
  byte array[4];
  uint32_t integer;
};

union arrayToUint16 {
  byte array[2];
  uint16_t integer;
};

void timeWriteEvent(BLECharacteristic& chr, uint8_t* data, uint16_t len, uint16_t offset){
  if(len != 4){
    return;
  }
  arrayToUint32 converter = {data[0],data[1],data[2],data[3]}; //Create a converter
  uint32_t timeSeed = converter.integer; //Read the 32bit integer value.
  setTime(timeSeed);
}

void targetTempWriteEvent(BLECharacteristic& chr, uint8_t* data, uint16_t len, uint16_t offset){
  if(len != 2){
    return;
  }
  arrayToUint16 converter = {data[0],data[1]}; //Create a converter
  targetTemp = converter.integer/10; //Read the 16bit integer value.
  readTargetTempCharacteristic.write16(targetTemp);
}

void endTimeWriteEvent(BLECharacteristic& chr, uint8_t* data, uint16_t len, uint16_t offset){
   if(len != 4){
    return;
  }
  arrayToUint32 converter = {data[0],data[1],data[2],data[3]}; //Create a converter
  endTime = converter.integer; //Read the 32bit integer value.
  readEndTimeCharacteristic.write32(endTime);
}

void startTimeWriteEvent(BLECharacteristic& chr, uint8_t* data, uint16_t len, uint16_t offset){
  if(len != 4){
    return;
  }
  arrayToUint32 converter = {data[0],data[1],data[2],data[3]}; //Create a converter
  startTime = converter.integer; //Read the 32bit integer value.
  readStartTimeCharacteristic.write32(startTime);
}

void startFanWriteEvent(BLECharacteristic& chr, uint8_t* data, uint16_t len, uint16_t offset){
  fanSpeed = data[0];
  if(fanSpeed == 0){
    digitalWrite(FAN, LOW);
  }
}

void increaseTemp(){
  fanSpeed += 5;
  if(fanSpeed > FAN_MAX_SPEED){
     fanSpeed = FAN_MAX_SPEED;
  }else if(fanSpeed < FAN_MIN_SPEED){
    fanSpeed = FAN_MIN_SPEED;
  }
    Serial.println("INCREASE");
    Serial.println(fanSpeed);
}

void decreaseTemp(){
  if(fanSpeed != 0){
    fanSpeed -= 5;
    if(fanSpeed < FAN_MIN_SPEED){
       fanSpeed = 0;
       digitalWrite(FAN, LOW);
    }
    Serial.println("DECREASE");
    Serial.println(fanSpeed);
  }
}

void checkTargetTemp(uint16_t temp){
    if(endTime < now()){
      targetTemp = 0;
      startTime = 0;
      endTime = 0;
      fanSpeed = 0;
      readTargetTempCharacteristic.write16(targetTemp);
      readStartTimeCharacteristic.write32(startTime);
      readEndTimeCharacteristic.write32(endTime);
      Serial.println("COOK DONE");
      return;
    }
    if(temp > targetTemp + 2){
      decreaseTemp();
    }else if(temp < targetTemp - 2){
      increaseTemp();
    }
}

uint16_t count = 0;

void checkTempStatus(){
  // call sensors.requestTemperatures() to issue a global temperature 
  // request to all devices on the bus
  sensors.requestTemperatures(); // Send the command to get temperatures
  uint16_t temp = sensors.getTempCByIndex(0) * 10; //* 10 so we send the first decimal
  if(targetTemp){
    if(count % 50000 == 0){
      checkTargetTemp(temp/10);  
    }
  }


  if(Bluefruit.connected()){
    tempCharacteristic.notify16(temp);
  }
}

void checkFanStatus(){
  if(fanSpeed != 0){
    if(count % 100 == 0){
      digitalWrite(FAN, HIGH);
      return;
    }else if(count % 100 == fanSpeed){
      digitalWrite(FAN, LOW);
    }
  }
}

void loop(void)
{ 
  count++;
  if(count > 50000){
    count = 0;
  }
  if(count % 2000 == 0){
    checkTempStatus();
  }

  checkFanStatus();
  delayMicroseconds(100);
}



