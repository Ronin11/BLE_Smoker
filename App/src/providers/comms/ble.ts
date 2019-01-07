import { Injectable, NgZone } from '@angular/core'
import { Subject } from 'rxjs'

import { Storage } from '@ionic/storage' 
import { BLE } from '@ionic-native/ble' 
import { ToastController } from 'ionic-angular'


const smokerServiceUuid = "fa4bfdd9-7c98-4913-9981-c5bfeaa73c1b"

@Injectable()
export class BLECommsProvider {
	isScanning

	deviceDiscoveredSubject = new Subject()

	constructor(
		private storage: Storage,
		private toastCtrl: ToastController,
		private zone: NgZone, 
		private ble: BLE) {
	}

	startScan(){
		this.isScanning = true
		this.ble.startScan([smokerServiceUuid]).subscribe(device => {
			this.zone.run(() => {
				this.deviceDiscoveredSubject.next(device)
			})
		},
		error => this.scanError(error))
	}

	connect(device){
		return this.ble.connect(device.id)
	}

	  // If location permission is denied, you'll end up here
	  scanError(error) {
		let toast = this.toastCtrl.create({
		  message: 'Error scanning for Bluetooth low energy devices',
		  position: 'middle',
		  duration: 5000
		});
		toast.present();
	  }
	


}
