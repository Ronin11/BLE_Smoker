import { Component } from '@angular/core' 

import { IonicPage, ViewController } from 'ionic-angular' 

import { MetricProvider } from '../../providers/metric/metric'
import { ToastController } from 'ionic-angular'
import { BleProvider } from '../../providers/ble/ble'

/**
 * Generated class for the CookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cook',
  templateUrl: 'cook.html'
})
export class CookPage {

 	 constructor(
		private ble: BleProvider,
		private metric: MetricProvider,
		public toastCtrl: ToastController,
		public viewCtrl: ViewController) {
	}
	
	startCook() {
		this.ble.startCook()
		this.showToast()
		this.dismiss()
	}

	dismiss() {
		this.viewCtrl.dismiss()
	}

	showToast() {
		const toast = this.toastCtrl.create({
			message: 'Cook has been started',
			showCloseButton: true,
			closeButtonText: 'Ok'
		});
		toast.present();
	}

}
