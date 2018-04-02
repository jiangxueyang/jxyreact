import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom'

@withRouter
export default class extends Component {
    componentWillMount () {
    }
    
    render () {
        let {pathname} = this.props.location
        if (pathname === '/') {
            return ('')
        } else {
            return (
                <div id='noMatch'>
                    <img src={require('@/assets/img/404.png')} alt=""/>
                    <p>页面不存在，<Link to={'/'}>回到首页</Link></p>
                </div>
            )
        }
        
    }
}