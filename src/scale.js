import MultiChartAbstract from './abstract.js'
import { extent } from 'd3-array'

export default class MultiChartScale extends MultiChartAbstract {
    constructor() {
        super()

        this.margin = { left: 25, right: 25, top: 25, bottom: 50 }

        this.xLimits = 'auto'
        this.yLimits = 'auto'
        this.xMin = 'auto'
        this.xMax = 'auto'
        this.yMin = 'auto'
        this.yMax = 'auto'

        this.container = null
        this.chart = null
        this.views = []

        this.observedAttributes = [
            'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
            'xLimits', 'yLimits'
        ]
        this.mapAttributesToProperties(this.observedAttributes)
        this.onAttributeChange(name => {
            if (name === 'class' && this.container) {
                this.container.classed(this.getAttribute('class'), true)
            }
            if (this.observedAttributes.map(x => x.toLocaleLowerCase()).includes(name)) {
                console.log(`scale attr "${name}" changed to ${this.getAttribute(name)}`)
                this.update()
            }
        })

        this.build(this.parentElement)
    }

    build(parentChart) {
        if (!parentChart) return

        this.setAttribute('style', 'display:none;')

        if (parentChart && parentChart.addScale) {
            this.chart = parentChart
            this.chart.addScale(this)
            this.container = this.chart.canvas.append('g')
        }
    }

    updateDataSet(dataSet) {
        this.views.forEach(view => view.updateDataSet(dataSet))
    }

    toX(value) {
        return this.xDomain(value);
    }

    toY(value) {
        return this.yDomain(value);
    }

    getCurrentMargins() {
        const margin = this.margin
        margin.left   = this.toMargin(this.marginLeft  , margin.left)
        margin.right  = this.toMargin(this.marginRight , margin.right)
        margin.top    = this.toMargin(this.marginTop   , margin.top)
        margin.bottom = this.toMargin(this.marginBottom, margin.bottom)
        return margin
    }
    
    toMargin(value, fallbackValue) {
        const parsed = parseFloat(value)
        if (isNaN(parsed)) {
            return fallbackValue
        }
        return parsed
    }

    getCurrentSize(margins) {
        return {
            width:  this.chart.size.width  - margins.left - margins.right,
            height: this.chart.size.height - margins.top  - margins.bottom
        }
    }

    addView(view) {
        this.views.push(view)
    }

    update() {
        const margins = this.getCurrentMargins()
        this.size = this.getCurrentSize(margins)

        this.container.attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

        if (!this.views.length) return

        const extents = this.getCurrentExtents()
        this.xExtent = extents.x
        this.yExtent = extents.y

        const domains = this.getDomains(extents)
        this.xDomain = domains.x
        this.xDomain.range([0, this.size.width])
        this.yDomain = domains.y
        this.yDomain.range([this.size.height, 0])

        this.views.forEach(view => view.update())
    }

    getCurrentExtents() {
        let xExtent = this.getJSONAttributeValue('xLimits') || 'auto'
        let yExtent = this.getJSONAttributeValue('yLimits') || 'auto'
        if (xExtent === 'auto' || yExtent === 'auto') {
            let extents = this.views.map(view => view.getExtent())
            if (xExtent === 'auto') {
                xExtent = extent(extents.map(extent => extent.x ).reduce((a,b) => a.concat(b)))
            }
            if (yExtent === 'auto') {
                yExtent = extent(extents.map(extent => extent.y ).reduce((a,b) => a.concat(b)))
            }
        }
    
        if (this.xMin !== 'auto') {
            xExtent[0] = this.xMin;
        }
        if (this.xMax !== 'auto') {
            xExtent[1] = this.xMax;
        }
        if (this.yMin !== 'auto') {
            yExtent[0] = this.yMin;
        }
        if (this.yMax !== 'auto') {
            yExtent[1] = this.yMax;
        }
    
        if (this.xSpace) {
            xExtent = MultiChartDomain.addSpace(xExtent, this.xSpace);
        }
        if (this.ySpace) {
            yExtent = MultiChartDomain.addSpace(yExtent, this.ySpace);
        }
    
        if (this.xInvert) {
            xExtent.reverse();
        }
        if (this.yInvert) {
            yExtent.reverse();
        }
    
        return {
            x: xExtent,
            y: yExtent
        }
    }

    connectedCallback() {
        this.build(this.parentElement)
    }
}

customElements.define('mc-scale', MultiChartScale);