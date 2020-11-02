import MultiChartView from '../view.js'
import { line } from 'd3-shape'

export default class MultiChartLineView extends MultiChartView {
    constructor() {
        super()
    }

    buildView() {
        this.path = this.container.append('path')
            .datum(this.data())

        this.dFactory = line()
            .x(d => this.scale.toX(d.x))
            .y(d => this.scale.toY(d.y))
    }

    update() {
        if (!this.path) return
        this.path.datum(this.data()).attr('d', this.dFactory)
    }
}

customElements.define('mc-line-view', MultiChartLineView);