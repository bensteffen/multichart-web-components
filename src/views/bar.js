import MultiChartView from '../view.js'

export default class MultiChartBarView extends MultiChartView {
    constructor() {
        super()

        this.observedAttributes = ['barWidthRatio', 'minBarWidth']
        this.mapAttributesToProperties(this.observedAttributes)

        this.onAttributeChange(name => {
            if (this.observedAttributes.map(x => x.toLocaleLowerCase()).includes(name)) {
                this.update()
            }
        })

        this.onDataSetUpdate(() => {
            if (!this.container) return

            this.container.selectAll('.bar').remove()
            this.buildView()
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`)
    }

    buildView() {
        
        this.container.selectAll('rect').data(this.data()).enter().append('rect')
          .classed('bar', true)
        //   .attr('data-id', function(d) { return d.id });
    }

    update() {
        if (!this.container || !this.scale.size) return 

        const data = this.data();

        let barWidthRatio = parseFloat(this.barWidthRatio) || 0.618;
        let minBarWidth = parseFloat(this.minBarWidth) || 2;
        let scaleWidth = this.scale.size.width
        let barNumber = data.length
        let barSlotSize = barNumber > 1 ? scaleWidth/(barNumber-1) : scaleWidth;
        let barWidth = Math.max(barWidthRatio*barSlotSize, minBarWidth);
    
        const getOffset = d =>
            d.y >= 0 ? this.scale.toY(d.y) : this.scale.toY(0)

        const getHeight = d =>
            d.y >= 0 ? this.scale.toY(0) - this.scale.toY(d.y) : this.scale.toY(d.y) - this.scale.toY(0)    
    
        this.container.selectAll('.bar').data(data)
          .attr('x', d => this.scale.toX(d.x) - 0.5*barWidth)
          .attr('y', getOffset)
          .attr('width', barWidth)
          .attr('height', getHeight)
    }
}

customElements.define('mc-bar-view', MultiChartBarView);