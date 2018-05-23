import { Injectable, NgZone } from '@angular/core' 
import { Storage } from '@ionic/storage' 
import { BLE } from '@ionic-native/ble' 

import { AlertController } from 'ionic-angular' 

import encoding from 'text-encoding' 

const bleSmokerUUID = '0011'
const bleSmokerTemperatureCharacteristic = '0012'
const bleSmokerTimeCharacteristic = '0013'

const deviceStorageKey = 'device'

@Injectable()
export class BleProvider {
	devices = [] 
	isScanning = false 
	connectedTo = null 
	decoder = new encoding.TextDecoder() 
	encoder = new encoding.TextEncoder() 
	temp = 0 

	constructor(private zone: NgZone,
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
		this.ble.startNotification(this.connectedTo, bleSmokerUUID, bleSmokerTemperatureCharacteristic).subscribe(readVal  => {
			var dv = new DataView(readVal, 0, 2)
			this.zone.run(() => {
				this.temp = dv.getUint16(0) / 10 //divide by 10 to get decimal
			})
		})
	}

	writeTime(){
		var uint32 = new Uint32Array(1) 
		uint32[0] = Date.now()/1000 //Convert Millis to Seconds
		this.ble.write(this.connectedTo, bleSmokerUUID, 
			bleSmokerTimeCharacteristic, uint32.buffer)
		.catch(err => {
			console.log("TIME WRITE ERR: ", err)
		})
	}

	connect(bleId){
		return new Promise((resolve, reject) => {
			this.ble.connect(bleId).subscribe((device) => {
				this.isScanning = false
				this.storage.set(deviceStorageKey, device.id)
				this.connectedTo = device.id
				this.startNotifications()
				this.writeTime()
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
}
