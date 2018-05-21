import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';

import encoding from 'text-encoding';

const bleUartId = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const bleUartWrite = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
const bleUartRead = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'

@Injectable()
export class BleProvider {
	devices = [];
	isScanning = false;
	connectedTo = null;
	decoder = new encoding.TextDecoder();
	encoder = new encoding.TextEncoder();

	constructor(private ble: BLE) {
		// console.log('Hello BleProvider Provider');
	}

	startScan(){
		this.isScanning = true;
		this.ble.startScan([bleUartId]).subscribe(device => {
			console.log("ARG")
			this.devices.push(device);
		})
	}
	
	stopScan(){
		this.isScanning = false;
		this.ble.stopScan()
	}
	
	startNotifications(){
		this.ble.startNotification(this.connectedTo, bleUartId, bleUartRead).subscribe(readVal  => {
			console.log(this.decoder.decode(readVal));
		});
	}

	connect(bleId){
		return new Promise((resolve, reject) => {
			this.ble.connect(bleId).subscribe((device) => {
				console.log("CONNECTED: ", device);
				this.connectedTo = device.id;
				this.startNotifications();
				resolve(device);
			})
		})
	}

	getTemp = async function(){
		return await this.write("!a");
	}

	write(buffer){
		return new Promise((resolve, reject) => {
			this.ble.write(this.connectedTo, bleUartId, bleUartWrite, this.encoder.encode(buffer).buffer);
		})
	}
}
