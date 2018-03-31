import React, {Component} from 'react';
import {withRouter, Switch, Route} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import homeRoutes from '@/router/home'
import Top from './comp/top'
import BlogList from './blog/list'
import Foot from './comp/foot'

@withRouter @inject('Auth') @observer
export default class extends Component {
    checkAuth = async () => {
        let uid = this.props.Auth.uid
        ! uid && await this.props.Auth.getAuth()
        
    }
    
    async componentWillMount () {
        this.checkAuth()
        this.props.history.listen((location,action)=>{
            window.scrollTo(0,0)
            this.checkAuth()
            
        })
        
    }
    
    componentDidMount () {
    
    }
    
    
    render () {
        let {loading} = this.props.Auth;
        if (loading) {
            return ''
        } else {
            let isIndex = this.props.location.pathname === '/';
            return (
                <div>
                    <Top></Top>
                    <div className='main'>
                        <div className='content'>
                            {isIndex && <BlogList></BlogList>}
                            <Switch>
                                {homeRoutes.map(route => (
                                    <Route key={route.name} {...route}/>
                                ))}
                            </Switch>
                        </div>
                    </div>
                    <Foot></Foot>
                </div>
            
            )
        }
        
        
    }
    
}