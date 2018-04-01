const webpack = require('webpack')
const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const path = require('path');
const fs = require('fs')
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/theme.less'), 'utf8'));
const rewireEslint = require('react-app-rewire-eslint');
const baseConfig = require('./config/base');
const ssh = require('ssh-webpack-plugin');
module.exports = function override (config, env) {
    config = rewireEslint(config, env);
    config = Object.assign({},config,baseConfig);
    const ssr = process.env.REACT_APP_SSR
    config = injectBabelPlugin('transform-decorators-legacy', config)
    config = injectBabelPlugin('syntax-dynamic-import',config)
    if (! ssr) {
        config = injectBabelPlugin(['import', {libraryName: 'antd', style: true}], config);
    }
    config = rewireLess.withLoaderOptions({
        modifyVars: themeVariables,
    })(config, env);
    
    if (! ssr && env === 'production') {
        let plugins = [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    // any required modules inside node_modules are extracted to vendor
                    return (
                        module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(
                            path.join(__dirname, '../node_modules')
                        ) === 0
                    )
                }
            }),
            new ssh({
                port: '22',
                host: '0.0.0.0',
                username: 'root',
                password: '123456',
                from: `build`,
                to: `/data/html/oa`
            })
        ]
        config.plugins = config.plugins.concat(plugins)
        config.devtool = false;
        
    }
    if (ssr) {
        // config.output.path += '-ssr'
        const nodeExternals = require('webpack-node-externals')
        config.externals = [nodeExternals()]
        // config.externals = {
        //   react: 'react',
        //   antd: 'antd',
        //   mobx: 'mobx',
        //   store: 'store',
        //   xss: 'xss',
        //   'react-dom': 'react-dom',
        //   'react-router-dom': 'react-router-dom',
        //   'mobx-react': 'mobx-react',
        //   'fullbase-axios': 'fullbase-axios',
        // }
        config.entry[1] = path.join(__dirname, './src/server.js')
        config.target = 'node'
        config.output.library = 'SSR'
        config.output.libraryTarget = 'umd'
        // config.plugins.splice(3, 1) // 删除 UglifyJsPlugin
    }
    
    return config;
};
