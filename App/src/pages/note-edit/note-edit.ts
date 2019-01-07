import { Component, ViewChild, ElementRef } from '@angular/core'
import { IonicPage, NavParams, ViewController } from 'ionic-angular'

import { DataProvider } from '../../providers/data/data'

@IonicPage()
@Component({
	selector: 'page-note-edit',
	templateUrl: 'note-edit.html',
})
export class NoteEditPage {
	// @ViewChild('myTextArea') myTextArea: ElementRef

	datum

	constructor(
		private dataProvider: DataProvider,
		public navParams: NavParams,
		public viewCtrl: ViewController
		) {
		this.datum = navParams.data
	}

	closeModal(showToast){
		this.viewCtrl.dismiss(showToast)
	}


}
