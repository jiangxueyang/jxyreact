import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import {Form, Icon, Input, Button} from 'antd';
import '@/assets/less/login.less'
import {Url} from '@/util/methods';

@withRouter @inject('Auth') @observer
class Login extends Component {
    Auth = ()=>{
        return this.props.Auth || {};
    }
    submit = async () => {
        const Auth = this.Auth()
        await Auth.login()
        let referrer = Url.get('url') || '/'
        window.location.replace(referrer)
        
        
    }
    
    change = (e) => {
        let value = e.target.value, key = e.target.name
        const Auth = this.Auth()
        const formObj = {}
        formObj[key] = value
        Auth.setForm('login', formObj)
        
    }
    press = (e)=>{
        const Auth = this.Auth()
        const status = Auth.loginStatus
        if(status.submit && !status.loading && e.keyCode === 13 ){
            this.submit();
            
        }
    }
    render () {
        const Auth = this.Auth()
        const form = Auth.loginForm,status = Auth.loginStatus
    
        return (
            <div id='login' className='cover' onKeyDown={this.press}>
                <Form onSubmit={this.submit} className="login-form center">
                    <div className='login-title'>登录</div>
                    <Input
                        prefix={<Icon type="user" className="icon"/>}
                        value={form.name}
                        name="name"
                        placeholder="账号"
                        onChange={this.change}
                        className="u-input"
                    />
                    <Input
                        prefix={<Icon type="lock" className="icon"/>}
                        value={form.password}
                        name="password"
                        type="password"
                        placeholder="密码"
                        onChange={this.change}
                        className="u-input"
                    />
                    <Button className="btn"
                            type='primary'
                            loading={status.loading}
                            disabled={! status.submit || status.loading}
                            onClick={this.submit}>
                        登录
                    </Button>
                
                </Form>
            
            </div>
        )
        
    }
    
}

export default Login