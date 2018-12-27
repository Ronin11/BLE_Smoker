import { Injectable } from '@angular/core'
import { CommsProvider } from '../comms/comms'
import { SettingsProvider } from '../settings/settings';

export enum EndCondition {
	TIME,
	TEMPERATURE
}

export const EndConditions = [
	{
		name: "Time",
		value: EndCondition.TIME
	},
	{
		name: "Target Temperature",
		value: EndCondition.TEMPERATURE
	}
]

export enum CookStatus {
	PAUSED,
	RUNNING,
	STOPPED
}

@Injectable()
export class CookProvider {
	cook = {
		startTime: null,

		targetTemperature: null,
		targetTemperatureThermocouple: null,
	
		endCondition: EndCondition,
		endConditionThermocouple: null,
		endConditionTargetTemperature: null,
		endTime: null
	}
	
	cookStatus: CookStatus
	autoResumeTimer
	// autoResumeTimeLeft
	formattedAutoResumeTimeLeft

	constructor(
		private settings: SettingsProvider,
		private comms: CommsProvider
		) {
		this.cookStatus = CookStatus.STOPPED
	}

	getCookStatusFromDevice(){
		
	}

	startCook(){
		this.cookStatus = CookStatus.RUNNING
	}

	pauseCook(){
		this.cookStatus = CookStatus.PAUSED
		this.startAutoResumeTimer()
	}

	resumeCook(){
		this.cookStatus = CookStatus.RUNNING
		clearTimeout(this.autoResumeTimer)
	}

	stopCook(){
		this.cookStatus = CookStatus.STOPPED
		clearTimeout(this.autoResumeTimer)
	}

	startAutoResumeTimer(){
		let time = this.settings.autoResumeTimer
		
		//The Credible Hulk always cites his sources: https://stackoverflow.com/questions/49631166/convert-seconds-to-hhmmss
		const secondsToHms = s => {
			const hours = ((s - s % 3600) / 3600) % 60
			const minutes = ((s - s % 60) / 60) % 60
			const seconds = s % 60
			let returnString = ''
			if(hours) returnString += `${hours}:`
			if(minutes) returnString += `${minutes}:`
			return `${returnString}${seconds}`
		}

		const startTimer = () => {
			this.autoResumeTimer = setTimeout(() => 
			{
				if(time <= 0) { 
					this.resumeCook()
					return
				}
				time -= 1
				this.formattedAutoResumeTimeLeft = secondsToHms(time)
				startTimer()
	 
			}, 1000)
		}
		startTimer()
	}

}
