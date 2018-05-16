import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';

const bleUartId = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const bleUartWrite = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
const bleUartRead = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
const bleId = 'DA:F3:58:B2:3D:96'

const bleString = function(string){
	let encoder = new TextEncoder()
	return encoder.encode(string).buffer
}

const oof = function(buff){
	let decoder = new TextDecoder()
	return decoder.decode(buff)
}

@Injectable()
export class BleProvider {

	constructor(private ble: BLE) {
		console.log('Hello BleProvider Provider');
	}

	startScan(){
		return this.ble.startScan([bleUartId])
	}
	stopScan(){
		this.ble.stopScan()
	}

				// ble.scan([], 30).subscribe((device) => {
			// 	console.log(device)
			// 	this.devices.push(device) 
			// })
			// this.ble.connect(bleId).subscribe(((val) => {
			// 	console.log("CONNECTED: ", val)
			// 	this.ble.write(bleId, bleUartId, bleUartWrite, bleString("!as"))
			// 	this.ble.startNotification(bleId, bleUartId, bleUartRead).subscribe(readVal  => {
			// 		console.log("READ: ", oof(readVal) )
			// 	})
			// }))

}
