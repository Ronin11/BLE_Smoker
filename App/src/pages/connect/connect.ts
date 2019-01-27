import { Component } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'

import { SpinnerDialog } from '@ionic-native/spinner-dialog'
import { Diagnostic } from '@ionic-native/diagnostic'

import { CommsProvider } from '../../providers/comms/comms'


@IonicPage()
@Component({
	selector: 'page-connect',
	templateUrl: 'connect.html',
})
export class ConnectPage {

	bleState

	constructor(
		private viewCtrl: ViewController,
		private spinnerDialog: SpinnerDialog,
		private diagnostic: Diagnostic,
		private comms: CommsProvider
		) {
			comms.ble.startScan()
			const bleEnabled = this.diagnostic.isBluetoothAvailable().then(
				state => {
					this.bleState = state
				},
				error => {
					console.log("ERROR: ", error)
				}
			)
	}

	connect(device){
		this.spinnerDialog.show("Connecting...")
		this.comms.connectToDevice(device, () => {
			this.spinnerDialog.hide()
			this.closeModal()
		})
	}

	closeModal(){
		this.viewCtrl.dismiss()
	}

	openSettings(){
		this.diagnostic.switchToBluetoothSettings()
	}
}
