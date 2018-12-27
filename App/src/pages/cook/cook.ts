import { Component } from '@angular/core' 

import {
	IonicPage,
	ModalController,
	ViewController,
	ToastController,
	Toast,
	Events
} from 'ionic-angular' 

import { SettingsProvider } from '../../providers/settings/settings'
import { CookProvider, EndConditions, EndCondition } from '../../providers/cook/cook'
import { HomePage } from '../home/home'
import { CookSummaryPage } from '../cook-summary/cook-summary'

import { temperatureSymbols } from '../../helpers/temperature'

@IonicPage()
@Component({
  selector: 'page-cook',
  templateUrl: 'cook.html'
})
export class CookPage {
	toast: Toast
	validated = true

	EndCondition = EndCondition
	EndConditions = EndConditions
	temperatureSymbols = temperatureSymbols

 	 constructor(
		public modalCtrl: ModalController,
		private settings: SettingsProvider,
		private cookProvider: CookProvider,
		public toastCtrl: ToastController,
		public events: Events) {
	}

	startCook() {
		const cookSummaryModal = this.modalCtrl.create(CookSummaryPage)
		cookSummaryModal.onDidDismiss(showToast => {
			if(showToast){
				this.cookProvider.startCook()
				this.events.publish('nav:swipeTo', HomePage);
				this.showToast()
			}
	   });
		cookSummaryModal.present()
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
		this.toast.present()
	}
}
