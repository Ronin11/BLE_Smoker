import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';

import encoding from 'text-encoding';

const bleSmokerUUID = '0011'
const bleSmokerTemperatureCharacteristic = '0012'

const deviceStorageKey = 'device'

@Injectable()
export class BleProvider {
	devices = [];
	isScanning = false;
	connectedTo = null;
	decoder = new encoding.TextDecoder();
	encoder = new encoding.TextEncoder();
	temp = 0;

	constructor(private zone: NgZone,
		private storage: Storage,
		private ble: BLE) {
			// ble.isConnected(bleSmokerUUID).then(val => {
			// 	console.log("CONNECTED: ", val)
			// })
	}

	isPreviousDeviceAvailable(){
		return new Promise((resolve, reject) => {
			this.storage.get(deviceStorageKey).then((savedDevice) => {
				if(savedDevice){
					this.isScanning = true;
					this.ble.startScan([bleSmokerUUID]).subscribe(device => {
						if(savedDevice == device.id){
							resolve(savedDevice)
						}
					})
				}
			});
		})
	}

	startScan(){
		this.isScanning = true;
		this.ble.startScan([bleSmokerUUID]).subscribe(device => {
			this.zone.run(() => {
				this.devices.push(device)
			})
		})
	}
	
	stopScan(){
		this.isScanning = false;
		this.ble.stopScan()
	}
	
	startNotifications(){
		this.ble.startNotification(this.connectedTo, bleSmokerUUID, bleSmokerTemperatureCharacteristic).subscribe(readVal  => {
			var dv = new DataView(readVal, 0, 2)
			this.zone.run(() => {
				this.temp = dv.getUint16(0)
			})
		})
	}

	connect(bleId){
		return new Promise((resolve, reject) => {
			this.ble.connect(bleId).subscribe((device) => {
				this.storage.set(deviceStorageKey, device.id);
				this.connectedTo = device.id;
				this.startNotifications();
				resolve(device);
			})
		})
	}
}
