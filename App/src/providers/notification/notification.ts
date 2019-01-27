import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'

import { LocalNotifications } from '@ionic-native/local-notifications'

@Injectable()
export class NotificationProvider {

	constructor(
		private localNotifications: LocalNotifications,
		private platform: Platform
	) {

  }
  sendNotification(title, text){
	this.localNotifications.schedule({
		title,
		text,
		sound: this.platform.is('android')? 'file://sound.mp3': 'file://beep.caf',
		// data: { secret: key }
		
	});
	}

}
