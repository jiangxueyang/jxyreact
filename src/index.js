import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router,HashRouter} from 'react-router-dom'
import {Provider} from 'mobx-react'
import {LocaleProvider} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

import AuthStore from '@/store/auth'
import BlogStore from '@/store/blog'
import FilterStore from '@/store/filter'

import Index from '@/view/index'
import registerServiceWorker from './registerServiceWorker'


import '@/assets/minireset.min.css'
import '@/assets/less/layout.less'
import 'nprogress/nprogress.css'

const Auth = new AuthStore()
const Blog = new BlogStore()
const Filter = new FilterStore()
ReactDOM.render(
    <Provider Auth={Auth} Blog={Blog} Filter={Filter}>
        <Router>
            <LocaleProvider locale={zh_CN}>
                <Index/>
            </LocaleProvider>
        </Router>
    
    </Provider>,
    document.getElementById('root'))
registerServiceWorker()
