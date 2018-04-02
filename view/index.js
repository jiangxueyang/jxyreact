import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom'

import indexRoutes from '@/router/index'

@withRouter
export default class extends Component {
    componentWillMount(){
    
    }
    render () {
        return (
            <div id='page'>
                <Switch>
                    {indexRoutes.map(route => (
                        <Route key={route.path} {...route}/>
                    ))}
                </Switch>
            </div>
        )
    }
}
