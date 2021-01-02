import MultiChartScale from '../scale.js'
import { scaleLinear } from 'd3-scale'

export default class MultiChartLinearScale extends MultiChartScale {
    constructor() {
        super()
    }

    getDomains(extents) {
        return {
            x: scaleLinear().domain(extents.x),
            y: scaleLinear().domain(extents.y)
        }
    }
}

customElements.define('mc-linear-scale', MultiChartLinearScale);