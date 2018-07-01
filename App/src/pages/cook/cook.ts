import { Component } from '@angular/core' 

import { IonicPage, ViewController, Toast } from 'ionic-angular' 

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
	targetTemp
	endTimePickerValue
	toast: Toast

 	 constructor(
		private ble: BleProvider,
		private metric: MetricProvider,
		public toastCtrl: ToastController,
		public viewCtrl: ViewController) {
	}
	
	startCook() {
		console.log(this.endTimePickerValue)
		// console.log(this.targetTemp)
		const arr = this.endTimePickerValue.split(':')
		const date = new Date()
		date.setHours(arr[0])
		date.setMinutes(arr[1])
		this.ble.endTime = (date.getTime()/1000).toFixed(0)
		this.ble.targetTemp = this.metric.convertTemp(this.targetTemp)
		this.ble.startTime = Date.now()/1000
		if(this.ble.endTime > this.ble.startTime){
			this.ble.startCook()
			this.showToast()
			this.dismiss()
		}else{
			this.showError()
		}
	}

	dismiss() {
		this.viewCtrl.dismiss()
	}

	showToast() {
		if(this.toast){
			this.toast.dismiss()
		}
		this.toast = this.toastCtrl.create({
			message: 'Cook has been started',
			showCloseButton: true,
			closeButtonText: 'Ok'
		});
		this.toast.present();
	}

	showError() {
		if(this.toast){
			this.toast.dismiss()
		}
		this.toast = this.toastCtrl.create({
			message: 'Cook end time has to be after current time!',
			showCloseButton: true,
			closeButtonText: 'Ok'
		});
		this.toast.present();
	}

}
