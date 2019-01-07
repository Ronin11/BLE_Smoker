import { Component } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'

import { SpinnerDialog } from '@ionic-native/spinner-dialog'

import { CommsProvider } from '../../providers/comms/comms'


@IonicPage()
@Component({
	selector: 'page-connect',
	templateUrl: 'connect.html',
})
export class ConnectPage {

	constructor(
		private viewCtrl: ViewController,
		private spinnerDialog: SpinnerDialog,
		private comms: CommsProvider
		) {
			comms.ble.startScan()
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

}
