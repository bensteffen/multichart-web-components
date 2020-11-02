import MultiChartAbstract from './abstract.js'
import MultiChartEval from './eval.js'
import { extent } from 'd3-array'

export default class MultiChartView extends MultiChartAbstract {
    constructor() {
        super()
        this.chart = null
        this.scale = null
        this.build(this.parentElement)

        this.onAttributeChange(name => {
            if (name === 'class' && this.container) {
                this.container.classed(this.getAttribute('class'), true)
            }
            if (name === 'extractor') {
                this.useExtractor(this.getAttribute('extractor'))
                this.update()
            }
        })

        if (this.getAttribute('extractor')) {
            this.useExtractor(this.getAttribute('extractor'))
        }
    }

    build(parentScale) {
        if (parentScale && parentScale.addView) {
            this.scale = parentScale
            this.scale.addView(this)

            this.chart = this.scale.chart
            this.updateDataSet(this.chart.dataSet || [])

            this.container = this.scale.container.append('g')
            this.buildView()
        }
    }

    updateDataSet(dataSet) {
        this.dataSet = dataSet
        this.extent = null
        if (this.onDataSetUpdateCallback) {
            this.onDataSetUpdateCallback()
        }
    }

    onDataSetUpdate(callback) {
        this.onDataSetUpdateCallback = callback
    }

    data() {
        if (!this.extractorFcn) {
            return []
        }
        return this.dataSet.map(this.extractorFcn)
    }

    useExtractor(extractor) {
        if (typeof extractor === 'string') {
            extractor = MultiChartEval.makeExtractor(extractor)
        }
        this.extractorFcn = extractor
        this.extent = null
    }

    set extractor(value) {
        this.useExtractor(value)
    }

    getExtent() {
        if (!this.extent) {
            this.extent = this.calculateExtent()
        }
        return this.extent
    }

    calculateExtent() {
        const data = this.data()
        if (data.length < 2) {
            return { x: [undefined, undefined], y: [undefined, undefined] }
        }
        return {
            x: extent(data.map(function(d) { return d.x })),
            y: extent(data.map(function(d) { return d.y }))
        }
    }

    newParent(parent) {
        this.build(parent)
        this.update()
    }
}
