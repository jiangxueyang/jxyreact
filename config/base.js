const path = require('path');
const webpack = require('webpack')

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

let webpackConfig = {
    resolve: {
        alias: {
            '@': resolve('src')
        }
    }
    
}


module.exports = webpackConfig;