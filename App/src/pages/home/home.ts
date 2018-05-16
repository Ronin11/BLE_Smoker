import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { BleProvider } from '../../providers/ble/ble';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BleProvider]
})
export class HomePage {
	devices = [];

  constructor(
	private ble: BleProvider, 
	public platform: Platform,
	public navCtrl: NavController) {
		platform.ready().then(() => {
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
		})
	}

	startScan(){
		this.ble.startScan().subscribe(device => {
			console.log(device)
			this.devices.push(device)
		})
	}

	// stopScan(){
	// 	this.ble.stopScan()
	// }

	// connect(id){
	// 	this.ble.connect(bleId).subscribe(((val) => {
	// 		console.log("CONNECTED: ", val)
	// 		let buffer = new ArrayBuffer(3)
	// 		let oof = new Uint8Array(buffer)
	// 		oof[0] = 0x61
	// 		oof[1] = 0x21
	// 		oof[2] = 0x00
	// 		this.ble.write(id, bleUartId, bleUartRX, buffer)
	// 	}))
	// }

}
