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

        this.observedAttributes = ['marginLeft', 'marginRight', 'marginTop', 'marginBottom']
        this.mapAttributesToProperties(this.observedAttributes)
        this.onAttributeChange(name => {
            if (name === 'class' && this.container) {
                this.container.classed(this.getAttribute('class'), true)
            }
            if (this.observedAttributes.map(x => x.toLocaleLowerCase()).includes(name)) {
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

    getMargin() {
        const margin = this.margin
        margin.left   = parseFloat(this.marginLeft)   || margin.left 
        margin.right  = parseFloat(this.marginRight)  || margin.right 
        margin.top    = parseFloat(this.marginTop)    || margin.top 
        margin.bottom = parseFloat(this.marginBottom) || margin.bottom 
        return margin
    }
    
    updateSize() {
        const margin = this.getMargin()
        this.size = {
            width:  this.chart.size.width  - margin.left - margin.right,
            height: this.chart.size.height - margin.top  - margin.bottom
        }
    }

    addView(view) {
        this.views.push(view)
    }

    update() {
        this.updateSize()
        const margin = this.getMargin()
        this.container.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        if (!this.views.length) return

        this.updateExtents()
        this.updateDomains()

        this.xDomain.range([0, this.size.width])
        this.yDomain.range([this.size.height, 0])

        this.views.forEach(view => view.update())
    }

    updateExtents() {
        let xExtent = this.xLimits;
        let yExtent = this.yLimits;
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
    
        this.xExtent = xExtent;
        this.yExtent = yExtent;
    }

    connectedCallback() {
        this.build(this.parentElement)
    }
}

customElements.define('mc-scale', MultiChartScale);