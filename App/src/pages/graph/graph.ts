import { Component, ViewChildren } from '@angular/core'
import { IonicPage, ModalController } from 'ionic-angular'

import { Chart } from 'chart.js'

import { NoteEditPage } from '../note-edit/note-edit'
import { DataProvider } from '../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html',
})
export class GraphPage {

	@ViewChildren('graphCanvas') graphElements

	graphs = []

	constructor(
		public modalCtrl: ModalController,
		private dataProvider: DataProvider
		) {

	}

	ionViewDidEnter() {
		let count = this.graphElements._results.length
		this.graphElements.changes.subscribe(elements => {
			if(count != elements._results.length){
				count = elements._results.length
				this.drawAllGraphs()
			}
		})
		this.drawAllGraphs()
	}

	expandCard(graph){
		graph.expanded = true
		this.graphs[graph.id].chart.legend.options.display = true
		this.graphs[graph.id].chart.update()
	}

	collapseCard(graph){
		graph.expanded = false
		this.graphs[graph.id].chart.legend.options.display = false
		this.graphs[graph.id].chart.update()
	}

	editNotes(graph) {
		const editNotesModal = this.modalCtrl.create(NoteEditPage, graph)
		editNotesModal.present()
	}

	drawAllGraphs(){
		for(let i = 0; i < this.graphElements._results.length; i++){
			this.graphs[i] = {
				canvas: this.graphElements._results[i],
				chart: this.drawGraph(this.dataProvider.data[i], this.graphElements._results[i])
			}
		}
	}

	drawGraph(cook, canvas){
		return new Chart(canvas.nativeElement, {
			type: 'line',
			options: {
				legend: {
					display: false,
					position: "bottom",
					fullWidth: true,
				},
				maintainAspectRatio: false
			},
			data: {
				labels: cook.labels,
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

