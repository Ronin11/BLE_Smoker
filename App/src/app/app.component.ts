import { Component, ViewChild } from '@angular/core'
import { 
	Platform, 
	Nav, 
	Events, 
	ModalController 
} from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'

import { SuperTabsComponent } from 'ionic2-super-tabs'

import { HomePage } from '../pages/home/home'
import { ConnectPage } from '../pages/connect/connect'
import { CookPage } from '../pages/cook/cook'
import { GraphPage } from '../pages/graph/graph'
import { SettingsPage } from '../pages/settings/settings'
import { CommsProvider } from '../providers/comms/comms'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(SuperTabsComponent) superTabs: SuperTabsComponent
	@ViewChild(Nav) nav: Nav

	pages = [
		{
			icon: "home",
			title: "Home",
			root: HomePage
		},
		{
			icon: "bonfire",
			title: "Cook",
			root: CookPage
		},
		{
			icon: "analytics",
			title: "History",
			root: GraphPage
		},
		{
			icon: "settings",
			title: "Settings",
			root: SettingsPage
		}
	]

	constructor(
		private commsProvider: CommsProvider,
		private platform: Platform, 
		private statusBar: StatusBar, 
		private splashScreen: SplashScreen,
		public modalCtrl: ModalController,
		public events: Events) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault() 
			splashScreen.hide()
			if(!this.commsProvider.isConnected()){
				const connectModal = this.modalCtrl.create(ConnectPage)
				connectModal.present()
			}

			events.subscribe('nav:swipeTo', pageRef => {
				this.pages.map((page, index) => {
					if(page.root == pageRef){
						this.slideNavigation(index)
					}
				})
			});
		}) 
	}

	slideNavigation(index){
		this.superTabs.slideTo(index)
	}
}

