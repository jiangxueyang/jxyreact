import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Button, Icon, Menu, Dropdown,Avatar} from 'antd'
import {inject} from 'mobx-react'

@withRouter @inject('Auth')
export default class extends Component {
    edit = () => {
        this.props.history.push('/add')
    }
    logout = () =>{
        this.props.Auth.logout()
    }
    menu = () => {
        return (
            <Menu>
                <Menu.Item><Link to={'/'}>文章列表</Link></Menu.Item>
                <Menu.Item><Link to={'/note'}>笔记本列表</Link></Menu.Item>
                <Menu.Item><Link to={'/tag'}>书签管理</Link></Menu.Item>
                <Menu.Item><Link to={'/img'}>图片管理</Link></Menu.Item>
                <Menu.Divider />
                <Menu.Item><a href='javascript:void(0)' onClick={this.logout}>退出登录</a></Menu.Item>
            </Menu>
        )
    }
    
    render () {
        return (
            <div id='top'>
                <div className="content container">
                    <Link className="logo fl" to={'/'}>后台管理系统</Link>
                    <Button className="write fr" type='primary' icon='edit' onClick={this.edit}>写文章</Button>
                    <Dropdown overlay={this.menu()} placement="bottomCenter">
                        
                        <span className="ant-dropdown-link fr" >
                            <Avatar  icon="user"/> <Icon type="down"/>
                        </span>
                    </Dropdown>
                
                </div>
            </div>
        )
    }
    
}