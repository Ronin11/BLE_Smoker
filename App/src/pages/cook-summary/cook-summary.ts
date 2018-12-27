import { Component } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'

import { CookProvider, EndCondition } from '../../providers/cook/cook'

@IonicPage()
@Component({
  selector: 'page-cook-summary',
  templateUrl: 'cook-summary.html',
})
export class CookSummaryPage {
	showToast = true
	EndCondition = EndCondition

	constructor(
		private cookProvider: CookProvider,
		public viewCtrl: ViewController
		) {

		}

	closeModal(showToast){
		this.viewCtrl.dismiss(showToast)
	}

}
