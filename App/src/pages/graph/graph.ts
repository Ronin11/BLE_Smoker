import { Component, ViewChildren } from '@angular/core'
import { IonicPage } from 'ionic-angular'

import { Chart } from 'chart.js'

import { TemperatureProvider } from '../../providers/temperature/temperature'

@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html',
})
export class GraphPage {

	@ViewChildren('graphCanvas') graphElements

	graphs

	constructor(private temperature: TemperatureProvider) {
		this.graphs = this.temperature.getCookData().map(data => 
			{
				return {
					data,
					expanded: false
				}
			}
		)
	}

	ionViewDidLoad() {
		const canvases = this.graphElements.toArray()
		for(let i = 0; i < this.graphs.length; i++){
			this.graphs[i].canvas = canvases[i]
		}

		this.drawAllGraphs()
	}

	expandCard(graph){
		graph.expanded = true
		graph.chart.legend.options.display = true
		graph.chart.update()
	}

	collapseCard(graph){
		graph.expanded = false
		graph.chart.legend.options.display = false
		graph.chart.update()
	}

	drawAllGraphs(){
		this.graphs.forEach(element => {
			element.chart = this.drawGraph(element.data, element.canvas)
		})
	}

	drawGraph(cook, canvas){
		return new Chart(canvas.nativeElement, {
			type: 'line',
			options: {
				legend: {
					display: false,
					position: "bottom",
				}
			},
			data: {
				labels: ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00"],
				datasets: cook.data.map(element => {
					return {
						label: element.name,
						fill: false,
						lineTension: 0.1,
						backgroundColor: element.color,
						borderColor: element.color,
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: element.color,
						pointBackgroundColor: "#fff",
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: element.color,
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						data: element.values,
						spanGaps: false,
					}
				})
			}
		})
	}
}

