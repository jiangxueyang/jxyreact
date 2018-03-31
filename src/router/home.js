import Loadable from 'react-loadable';
import Loding from '@/view/comp/loading';

export default [
    {
        path: '/add',
        component: Loadable({
            loader: () => import('@/view/blog/edit'),
            loading: Loding
        }),
        name:'add'
    },
    {
        path:'/blog/edit/:blog_id',
        component: Loadable({
            loader: () => import('@/view/blog/edit'),
            loading: Loding
        }),
        name:'edit'
    },
    {
        path: '/note',
        component: Loadable({
            loader: () => import('@/view/note/list'),
            loading: Loding
        }),
        name:'note'
    },
    {
        path: '/blogByNote/:note_id',
        component: Loadable({
            loader: () => import('@/view/blog/list'),
            loading: Loding
        }),
        name:'blogByNote'
    },
    {
        path:'/tag',
        component: Loadable({
            loader: () => import('@/view/tag/list'),
            loading: Loding
        }),
        name:'tag'
    },
    {
        path:'/blogByTag/:tag_id',
        component: Loadable({
            loader: () => import('@/view/blog/list'),
            loading: Loding
        }),
        name:'blogByTag'
    },
    
    {
        path:'/blog/detail/:blog_id',
        component: Loadable({
            loader: () => import('@/view/blog/detail'),
            loading: Loding
        }),
        name:'blogDetail'
    },
    {
        path:'/img',
        component: Loadable({
            loader: () => import('@/view/img/list'),
            loading: Loding
        }),
        name:'imgList'
    },
    {
        component: Loadable({
            loader: () => import('@/view/noMatch'),
            loading: Loding
        }),
        name:'noMatch'
    }
]