import MultiChartAbstract from './abstract.js'
import { select } from 'd3-selection'

export default class MultiChart extends MultiChartAbstract {
    constructor() {
        super()
        this.build(this.parentElement)
    }

    build(parentElement) {
        if (!parentElement) return

        this.setAttribute('style', 'display:block;')
    
        this.parentResizeObserver = new ResizeObserver(() => this.update())
        this.parentResizeObserver.observe(parentElement)

        this.scales = []
        this.canvas = select(this).append('svg')
            .style('width', '100%')
            .style('height', '100%');

        this.dataSet = []

        this.update()
    }

    set dataSet(dataSet) {
        this.scales.forEach(scale => scale.updateDataSet(dataSet))
    }

    addScale(scale) {
        this.scales.push(scale)
    }

    update() {
        this.updateSize()
        this.scales.forEach(scale => scale.update())
    }

    updateSize() {
        const boundingClientRect = this.canvas.node().getBoundingClientRect()
        this.size = {
            width: boundingClientRect.width,
            height: boundingClientRect.height
        }
    }
    
    connectedCallback() {
        this.build(this.parentElement)
    }
}

customElements.define('mc-chart', MultiChart);