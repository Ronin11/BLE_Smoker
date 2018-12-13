import { Injectable, NgZone } from '@angular/core' 
import { Observable } from 'rxjs'
import { Storage } from '@ionic/storage' 
import { BLE } from '@ionic-native/ble' 

import { AlertController } from 'ionic-angular' 

import { MetricProvider } from '../metric/metric';

const bleSmokerUUID = '0011'
const readTempCharacteristic = '0012'
const writeTimeCharacteristic = '0013'
const readTargetTempCharacteristic = '0014'
const writeTargetTempCharacteristic = '0015'
const readStartTimeCharacteristic = '0016'
const writeStartTimeCharacteristic = '0017'
const readEndTimeCharacteristic = '0018'
const writeEndTimeCharacteristic = '0019'
const writeFanSpeedCharacteristic = '0020'

const deviceStorageKey = 'device'

@Injectable()
export class BleProvider {
	devices = [] 
	isScanning = false 
	connectedTo = null

	temp = 0
	startTime = null
	endTime = null
	endTimePickerValue = null
	targetTemp = null

	countDown = null
	timer = null
	isCookDone = true
	hours: any
	minutes: any
	seconds: any

	constructor(
		private metric: MetricProvider,
		private zone: NgZone,
		private storage: Storage,
		private ble: BLE,
		public alertCtrl: AlertController) {
	}

	isPreviousDeviceAvailable(){
		return new Promise((resolve, reject) => {
			this.storage.get(deviceStorageKey).then((savedDevice) => {
				if(savedDevice){
					this.ble.disconnect(savedDevice)
					this.isScanning = true
					this.ble.startScan([bleSmokerUUID]).subscribe(device => {
						if(savedDevice == device.id){
							resolve(savedDevice)
						}
					})
				}
			}) 
		})
	}

	removeSavedDevice(){
		this.isScanning = false 
		this.ble.disconnect(this.connectedTo)
		this.zone.run(() => {
			this.connectedTo = null
		})
		this.storage.remove(deviceStorageKey)
		console.log("OOF: ", this.connectedTo)
	}

	startScan(){
		this.isScanning = true 
		this.ble.startScan([bleSmokerUUID]).subscribe(device => {
			this.zone.run(() => {
				this.devices.push(device)
			})
		})
	}
	
	stopScan(){
		this.isScanning = false 
		this.ble.stopScan()
	}
	
	startNotifications(){
		this.ble.startNotification(this.connectedTo, bleSmokerUUID, readTempCharacteristic).subscribe(readVal  => {
			var dv = new DataView(readVal, 0, 2)
			this.zone.run(() => {
				this.temp = dv.getUint16(0, true) / 10 //divide by 10 to get decimal
			})
		})
	}

	writeTime(){
		var uint32 = new Uint32Array(1) 
		uint32[0] = Date.now()/1000 //Convert Millis to Seconds
		this.ble.write(this.connectedTo, bleSmokerUUID, 
			writeTimeCharacteristic, uint32.buffer)
		.catch(err => {
			console.log("TIME WRITE ERR: ", err)
		})
	}

	readTargetTemp(){
		this.ble.read(this.connectedTo, bleSmokerUUID, readTargetTempCharacteristic)
		.then(data => {
			var dv = new DataView(data, 0, 2)
			this.zone.run(() => {
				this.targetTemp = dv.getUint16(0, true) / 10 //divide by 10 to get decimal
			})
		}).catch(err => {
			console.log("TARGET TEMP READ ERR: ", err)
		})
	}

	writeTargetTemp(targetTemp){
		var uint16 = new Uint16Array(1)
		uint16[0] = (targetTemp * 10)
		this.ble.write(this.connectedTo, bleSmokerUUID, 
			writeTargetTempCharacteristic, uint16.buffer)
		.catch(err => {
			console.log("TARGET TEMP WRITE ERR: ", err)
		})
	}

	readStartTime(){
		this.ble.read(this.connectedTo, bleSmokerUUID, readStartTimeCharacteristic)
		.then(data => {
			var dv = new DataView(data, 0, 4)
			this.zone.run(() => {
				this.startTime = dv.getUint32(0, true)
			})
		}).catch(err => {
			console.log("START TIME READ ERR: ", err)
		})
	}

	writeStartTime(startTime){
		var uint32 = new Uint32Array(1)
		uint32[0] = startTime
		this.ble.write(this.connectedTo, bleSmokerUUID, 
			writeStartTimeCharacteristic, uint32.buffer)
		.catch(err => {
			console.log("START TIME WRITE ERR: ", err)
		})
	}

	readEndTime(){
		this.ble.read(this.connectedTo, bleSmokerUUID, readEndTimeCharacteristic)
		.then(data => {
			var dv = new DataView(data, 0, 4)
			this.zone.run(() => {
				this.endTime = dv.getUint32(0, true)
				this.startCountdown()
			})
		}).catch(err => {
			console.log("END TIME READ ERR: ", err)
		})
	}

	writeEndTime(endTime){
		var uint32 = new Uint32Array(1)
		uint32[0] = endTime
		this.ble.write(this.connectedTo, bleSmokerUUID, 
			writeEndTimeCharacteristic, uint32.buffer)
		.catch(err => {
			console.log("END TIME WRITE ERR: ", err)
		})
	}

	writeFanSpeed(speed){
		if(speed > 100){
			speed = 100
		}else if(speed < 0){
			speed = 0
		}
		var uint8 = new Uint8Array(1)
		uint8[0] = speed
		this.ble.write(this.connectedTo, bleSmokerUUID,
			writeFanSpeedCharacteristic, uint8.buffer)
	}

	connect(bleId){
		return new Promise((resolve, reject) => {
			this.ble.connect(bleId).subscribe((device) => {
				this.isScanning = false
				this.storage.set(deviceStorageKey, device.id)
				this.connectedTo = device.id
				this.startNotifications()
				this.writeTime()
				this.readTargetTemp()
				this.readStartTime()
				this.readEndTime()

				// this.writeFanSpeed(100)
				resolve(device)
			}, err => {
				console.log("CONNECT ERROR: ", err)
				this.connectedTo = null
				this.showDisconnectedAlert(err)
			})
		})
	}

	showDisconnectedAlert(err) {
		let alert = this.alertCtrl.create({
		  title: 'Device Disconnected',
		  subTitle: `${err.name} was disconnected.`,
		  buttons: ['OK']
		}) 
		alert.present() 
	}

	startCook(){
		this.countDown = this.endTime - this.startTime
		if(this.countDown > 0){
			this.writeStartTime(this.startTime)
			this.writeEndTime(this.endTime)
			this.writeTargetTemp(this.targetTemp)
			this.isCookDone = false
			this.startCountdown()
		}else{
			throw("TIME IS BAD")
		}
	}

	startCountdown(){
		this.countDown = this.endTime - Date.now()/1000
		this.timer = Observable.interval(1000).subscribe(x => {
			if (--this.countDown < 0) {
				this.isCookDone = true
				this.stopCountdown()
			}else{
				this.isCookDone = false
				this.hours = Math.floor(this.countDown / 3600)
				this.minutes = Math.floor((this.countDown % 3600) / 60)
				this.seconds = Math.floor((this.countDown % 3600) % 60)

				this.hours = this.hours < 10 ? "0" + this.hours : this.hours
				this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes
				this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds
			}
		})
	}

	stopCountdown(){
		this.timer.unsubscribe()
	}
}
