export default class MultiChartAbstract extends HTMLElement {
    constructor() {
        super();

        this.attributeChangeCallback = []

        this.mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                switch (mutation.type) {
                    case 'childList':
                        mutation.addedNodes.forEach(node => {
                            if (this.newChild) {
                                this.newChild.call(this, node);
                            }
                            if (node['newParent']) {
                                node['newParent'].call(node, node.parentElement);
                            }
                        })
                        break;
                    case 'attributes':
                        this.attributeChangeCallback.forEach(callback => {
                            callback(mutation.attributeName, mutation.oldValue)
                        })
                }
            });
        })
        this.mutationObserver.observe(this, { attributes: true, childList: true });
    }

    onAttributeChange(callback) {
        this.attributeChangeCallback.push(callback)
    }

    mapAttributesToProperties(names) {
        if (!Array.isArray(names)) names = [names]

        names.forEach(name => {
            Object.defineProperty(this, name, {
                get() {
                    return this.getAttribute(name)
                },
                set(value) {
                    if (value && value != this.getAttribute(name)) {
                        this.setAttribute(name, value);
                    } else {
                        this.removeAttribute(name);
                    }
                }
            })
        })
    }
}
