import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';

import { NgxGaugeModule } from 'ngx-gauge';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BleProvider } from '../providers/ble/ble';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
	BrowserModule,
	NgxGaugeModule,
	IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
	BLE,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BleProvider
  ]
})
export class AppModule {}
