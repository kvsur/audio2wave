const path = require('path');
module.exports = {
    entry: './demo/index.js',
    output: {
        path: path.resolve(__dirname, './demo/dist/'),
        filename: 'index.js',
    }
}