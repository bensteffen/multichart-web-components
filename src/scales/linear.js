import MultiChartScale from '../scale.js'
import { scaleLinear } from 'd3-scale'

export default class MultiChartLinearScale extends MultiChartScale {
    constructor() {
        super()
    }

    updateDomains() {
        this.xDomain = scaleLinear().domain(this.xExtent)
        this.yDomain = scaleLinear().domain(this.yExtent)
    }
}

customElements.define('mc-linear-scale', MultiChartLinearScale);