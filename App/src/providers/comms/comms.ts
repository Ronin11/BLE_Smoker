import { Subject } from 'rxjs' 
import { HTTP } from '@ionic-native/http'
import { Injectable } from '@angular/core'

import { BLECommsProvider } from './ble'

@Injectable()
export class CommsProvider {

	connected = true

	discoveredDevices = []

	temperatureSubject = new Subject()

	private connectedBLE
	private connectedWifi
	private connectedHttps

	constructor(
		public ble: BLECommsProvider,
		private http: HTTP
		) {
		this.spamFakeData()
		this.ble.deviceDiscoveredSubject.subscribe(device => {
			this.discoveredDevices = [...this.discoveredDevices, device]
		})
	}

	connectToDevice(device, callback){
		this.ble.connect(device).subscribe(
			device => {
				this.connected = true
				if(callback){
					callback(device)
				}
			},
			error => {
				console.log("ERR: ", error)
			}
		)
	}

	connect(){
		//try to reconnect to previous device, if not, start scanning
	}

	spamFakeData(){
		let i = 0
		const startTimer = () => {
			setTimeout(() => 
			{
				this.temperatureSubject.next(
					{
						0: i++,
						1: i+5,
						3: i+10,
					}
				)
				startTimer()
	 
			}, 1000)
		}
		startTimer()
	}

}
