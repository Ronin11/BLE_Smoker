import { Injectable } from '@angular/core'

import { CommsProvider } from '../comms/comms'

@Injectable()
export class TemperatureProvider {

	currentTemperatures = [
		{
			name: "Thermocouple 1",
			value: 120
		},
		{
			name: "Thermocouple 2",
			value: 110
		}
	]

	constructor(private comms: CommsProvider) {}

	getCookData() {
		return [
			{
				name: "Roast1",
				date: "12/20/2018",
				notes: 
				`
					1
					The best Notesasdfasdfasdfasdf
					asdfasdf
					asdfasdfasdf
					asdfasdf
				`,
				data: [
					{
						name: "Thermocouple 2",
						values: [120, 80, 90, 110, 60, 70, 85],
						color: "rgb(0,255,0)"
					},
					{
						name: "Thermocouple 3",
						values: [80, 85, 90, 110, 65, 82, 79],
						color: "rgb(0,0,255)"
					},
					{
						name: "Thermocouple 4",
						values: [15, 29, 30, 21, 16, 45, 20],
						color: "rgb(255,0,0)"
					},
					{
						name: "Thermocouple 5",
						values: [120, 180, 190, 180, 160, 170, 185],
						color: "rgb(0,255,0)"
					},
					{
						name: "Thermocouple 6",
						values: [180, 185, 140, 150, 215, 182, 99],
						color: "rgb(0,0,255)"
					}
				]
			},
			{
				name: "Roast2",
				date: "12/22/2018",
				notes: 
				`
					2
					The best Notesasdfasdfasdfasdf
					asdfasdf
					asdfasdfasdf
					asdfasdf
				`,
				data: [
					{
						name: "Thermocouple 1",
						values: [65, 59, 80, 81, 56, 55, 40],
						color: "rgb(255,0,0)"
					},
					{
						name: "Thermocouple 3",
						values: [80, 85, 90, 110, 65, 82, 79],
						color: "rgb(0,0,255)"
					},
					{
						name: "Thermocouple 4",
						values: [15, 29, 30, 21, 16, 45, 20],
						color: "rgb(255,0,0)"
					},
					{
						name: "Thermocouple 5",
						values: [120, 180, 190, 180, 160, 170, 185],
						color: "rgb(0,255,0)"
					},
					{
						name: "Thermocouple 6",
						values: [180, 185, 140, 150, 215, 182, 99],
						color: "rgb(0,0,255)"
					}
				]
			},
			{
				name: "Roast3",
				date: "12/23/2018",
				data: [
					{
						name: "Thermocouple 1",
						values: [65, 59, 80, 81, 56, 55, 40],
						color: "rgb(255,0,0)"
					},
					{
						name: "Thermocouple 2",
						values: [120, 80, 90, 110, 60, 70, 85],
						color: "rgb(0,255,0)"
					},
					{
						name: "Thermocouple 4",
						values: [15, 29, 30, 21, 16, 45, 20],
						color: "rgb(255,0,0)"
					},
					{
						name: "Thermocouple 5",
						values: [120, 180, 190, 180, 160, 170, 185],
						color: "rgb(0,255,0)"
					},
					{
						name: "Thermocouple 6",
						values: [180, 185, 140, 150, 215, 182, 99],
						color: "rgb(0,0,255)"
					}
				]
			}
		]
	}
}
