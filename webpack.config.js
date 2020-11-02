const path = require('path');

module.exports = {
    output: {
        library: 'MultiChartWebComponents',
        libraryTarget: 'umd',
        filename: 'multichartwebcomponents.js',
        // path: path.resolve(__dirname, 'res/js')
        // auxiliaryComment: 'Test Comment'
    },
    optimization: {
        minimize: false
    },
};
