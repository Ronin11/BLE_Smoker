import { BrowserModule } from '@angular/platform-browser' 
import { ErrorHandler, NgModule } from '@angular/core' 

import { SplashScreen } from '@ionic-native/splash-screen' 
import { SpinnerDialog } from '@ionic-native/spinner-dialog'
import { StatusBar } from '@ionic-native/status-bar' 
import { IonicStorageModule } from '@ionic/storage' 
import { Diagnostic } from '@ionic-native/diagnostic'
import { BLE } from '@ionic-native/ble' 
import { HTTP } from '@ionic-native/http'

import { SuperTabsModule } from 'ionic2-super-tabs'

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular' 

import { NgxGaugeModule } from 'ngx-gauge' 

import { MyApp } from './app.component' 
import { HomePage } from '../pages/home/home' 
import { CookPage } from '../pages/cook/cook'
import { CookSummaryPage } from '../pages/cook-summary/cook-summary'
import { GraphPage } from '../pages/graph/graph'
import { NoteEditPage } from '../pages/note-edit/note-edit'
import { ConnectPage } from '../pages/connect/connect'
import { SettingsPage } from '../pages/settings/settings'

import { SettingsProvider } from '../providers/settings/settings'
import { BLECommsProvider } from '../providers/comms/ble'
import { CommsProvider } from '../providers/comms/comms'
import { DataProvider } from '../providers/data/data'
import { CookProvider } from '../providers/cook/cook'
import { NotificationProvider } from '../providers/notification/notification';

import { Autosize } from '../directives/autosize/autosize'
import { TabIndexDirective } from '../directives/tab-index/tab-index'

import { HhmmssPipe } from '../pipes/hhmmss/hhmmss'
import { AvailableThermocouplesPipe } from '../pipes/available-thermocouples/available-thermocouples'
import { GraphDataPipe } from '../pipes/graph-data/graph-data'


@NgModule({
	declarations: [
		MyApp,
		HomePage,
		ConnectPage,
		CookPage,
		CookSummaryPage,
		GraphPage,
		NoteEditPage,
		SettingsPage,
		Autosize,
		TabIndexDirective,
		HhmmssPipe,
		GraphDataPipe,
		AvailableThermocouplesPipe
	],
	imports: [
		BrowserModule,
		NgxGaugeModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot(),
		SuperTabsModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		ConnectPage,
		CookPage,
		CookSummaryPage,
		GraphPage,
		NoteEditPage,
		SettingsPage
	],
	providers: [
		BLE,
		HTTP,
		Diagnostic,
		StatusBar,
		SplashScreen,
		SpinnerDialog,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		SettingsProvider,
		BLECommsProvider,
		CommsProvider,
		DataProvider,
		CookProvider,
		DataProvider,
    	NotificationProvider
	]
})
export class AppModule {}
