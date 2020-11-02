import MultiChartView from '../view.js'

export default class MultiChartLabelView extends MultiChartView {
    constructor() {
        super()

        this.observedAttributes = ['rotate', 'offset']
        this.mapAttributesToProperties(this.observedAttributes)

        this.onAttributeChange(name => {
            if (this.observedAttributes.map(x => x.toLocaleLowerCase()).includes(name)) {
                this.update()
            }
        })

        this.onDataSetUpdate(() => {
            if (!this.container) return

            this.container.selectAll('text').remove()
            this.buildView()
        })
    }

    buildView() {
        this.labels = this.container.selectAll('text')
        this.labels.data(this.data()).enter().append('text')
          .attr('data-id', d => d.id)
    }

    update() {
        let rotate = parseFloat(this.rotate)
        rotate = isNaN(rotate) ? 0 : rotate

        let offset = parseFloat(this.offset)
        offset = isNaN(offset) ? -8 : offset
    
        this.container.selectAll('text').data(this.data())
            .attr('transform', d => {
                let dy = this.scale.toY(d.y) + (d.offset || offset)
                return `translate(${this.scale.toX(d.x)},${dy}) rotate(${rotate})`
            })
            .text(d => d.label)
    }
}

customElements.define('mc-label-view', MultiChartLabelView)