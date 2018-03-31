
import Loadable from 'react-loadable';
import Loding from '@/view/comp/loading';

export default [
    {
        path:'/login',
        component:Loadable({
            loader: () => import('@/view/login'),
            loading:Loding
        })
    },{
        path:'/',
        component:Loadable({
            loader: () => import('@/view/home'),
            loading:Loding
        })
    }
]