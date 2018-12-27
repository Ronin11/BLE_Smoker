import { Injectable } from '@angular/core'
import { CommsProvider } from '../comms/comms'

@Injectable()
export class SettingsProvider {
	//TODO Set default settings, and then pull from static storage
	units = "farenheit"
	// functionality = {
	// 	canStart: true
	// }

	autoResumeTimer = 300


	constructor(private comms: CommsProvider) {}

}
