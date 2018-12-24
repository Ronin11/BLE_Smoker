import { Component } from '@angular/core'
import { IonicPage } from 'ionic-angular'

import { SettingsProvider } from '../../providers/settings/settings'

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

	constructor(private settings: SettingsProvider) {

	}

}
