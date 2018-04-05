import {observable, action} from 'mobx'
import * as api from '@/api';
import Form from './decorator/form'
import store from 'store';

@Form
class UserAuthStore {
    @observable uid = ''
    @observable loading = false
    @observable loginForm = {name: '', password: ''}
    @observable loginStatus = {submit: false, loading: false}
    @observable loginErrs = {name: '', password: ''}
    @observable loginRules = {
        name: {rules: 'required|nameOrPhoneOrMail', aliasName: '用户名'},
        password: {rules: 'required|password', aliasName: '密码'}
    }
    
    @action
    async getAuth () {
        this.loading = true;
        let res = await api.auth().catch(e=>{
            console.log(e,'e')
        });
        this.uid = res ?res.uid : '';
        this.loading = false;
    }
    
    @action
    async login () {
        let {loginForm} = this;
        this.loginStatus.loading = true;
        let res = await api.login(loginForm).finally(_=>{
            this.loginStatus.loading = false;
        });
        let {token} = res;
        store.set('loginedtoken',token);
        
    }
    
    @action
    async logout(){
        await api.logout();
        store.remove('loginedtoken');
        window.location.replace('/login');
    }
    
}

export default UserAuthStore;