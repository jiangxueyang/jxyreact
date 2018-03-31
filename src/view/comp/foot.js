import React, {Component,Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {BackTop} from 'antd'

export default class extends Component{
    render(){
        return (
            <Fragment>
                <BackTop></BackTop>
            </Fragment>
        )
    }
}