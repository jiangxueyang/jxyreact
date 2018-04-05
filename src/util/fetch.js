import axios from 'axios';
import {message} from 'antd';
import loading from '@/util/loading'
import store from 'store';
// 创建axios实例
const service = axios.create({
    baseURL: process.env.baseUrl,		// api的base_url
    timeout: 20000, 					// 请求超时时间
    headers: {
    }
});

// request拦截器
service.interceptors.request.use(config => {
    let data = config.data || {},params = config.params || {};
    let loginedtoken = store.get('loginedtoken');
    let time = Date.now();
    let {headers} = config;
    headers = {...headers,loginedtoken};
    params = {...params,_:time};
    config = {...config,params,headers};
    if(data.loading !== false && params.loading !== false){
        loading.init();
    }
    if (process.env.target !== 'production') {
    }
    return config;
}, error => {
    loading.close();
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    async ({data}) => {
        let code = +data.code;
        loading.close();
        if (code === 0 ) {
            return data.data || {};
        } else if (code === 1005) {
            message.error('登录过期，请重新登录！');
            let url = window.location.href;
            window.location.replace(`/login?url=${encodeURIComponent(url)}`);
            return Promise.reject(data);
        
        }else {
            message.error(data.msg || '请求错误');
            return Promise.reject(data)
        }
    },
    error => {
        loading.close();
        return Promise.reject(error);
    }
)

export default service;