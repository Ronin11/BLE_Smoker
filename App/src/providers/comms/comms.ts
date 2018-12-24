import { BLE } from '@ionic-native/ble' 
import { HTTP } from '@ionic-native/http'
import { Injectable } from '@angular/core'

@Injectable()
export class CommsProvider {

	connected = true
	temps = [100]

	constructor(
		private ble: BLE,
		private http: HTTP
		) {

	}

	isConnected(){
		return this.connected
	}

}
