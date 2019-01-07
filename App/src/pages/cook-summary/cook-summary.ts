import { Component } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'

import { SettingsProvider } from '../../providers/settings/settings'
import { CookProvider, EndCondition } from '../../providers/cook/cook'

import { temperatureSymbols } from '../../helpers/temperature'
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-cook-summary',
  templateUrl: 'cook-summary.html',
})
export class CookSummaryPage {
	showToast = true
	EndCondition = EndCondition


	temperatureSymbols = temperatureSymbols

	constructor(
		private settings: SettingsProvider,
		private data: DataProvider,
		private cookProvider: CookProvider,
		public viewCtrl: ViewController
		) {

		}

	closeModal(showToast){
		if(showToast){
			this.data.createCook(this.cookProvider.cook)
		}
		this.viewCtrl.dismiss(showToast)
	}

}
