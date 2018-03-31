import {default as fetch} from '@/util/fetch';

/**
 *登录
 */

export function login(data){
    return fetch({
        url:'/oa/login',
        method:'post',
        data
    })
}


export function auth() {
    return fetch({
        url:'/oa/user/auth',
        method:'get'
    })
}

export function logout(){
    return fetch({
        url:'/oa/quit',
        method:'post'
    })
}

/*添加blog*/
export function addBlog(data) {
    return fetch({
        url:'/oa/user/addBlog',
        method:'post',
        data
    })
}

/**
 修改blog
 */
export function modifyBlog(data) {
    return fetch({
        url:'/oa/user/modifyBlog',
        method:'post',
        data
    })
}

/** 查看blog的内容*/

export function blogDetail(blogId) {
    return fetch({
        url:`/oa/blog/${blogId}`,
        method:'get'
    })
}

//根据blogId查询标签
export function blogTag(blogId){
    return fetch({
        url:`/oa/blogTag/${blogId}`,
        method:'get'
    })
}
/**查看我的blog列表，包含已发布*/
export function myBlogList(params) {
    return fetch({
        url:'/oa/user/myBlog',
        method:'get',
        params
    })
}

//查询所有标签
export function tagList(params) {
    return fetch({
        url:'/oa/user/allTag',
        method:'get',
    })
}
//新增标签
export function addTag(data){
    return fetch({
        url:'/oa/user/addTag',
        method:'post',
        data
    })
}

//根据tag_id 查询所有blog
export function blogByTag(params){
    return fetch({
        url:'/oa/user/blogByTag',
        method:'get',
        params
    });
}
//查询我的所有笔记本
export function myNoteList(params) {
    return fetch({
        url:'/oa/user/myNote',
        method:'get',
        params
    })
}

//增加笔记 本
export function addNote(data) {
    return fetch({
        url:'/oa/user/addNote',
        method:'post',
        data
    })
}

//查看笔记 本详情
export function noteDetail(id){
    return fetch({
        url:`/oa/user/noteDetail/${id}`,
        method:'get'
    })
}
//删除文章
export function removeBlog(data) {
    return fetch({
        url:`/oa/user/removeBlog`,
        method:'post',
        data
    })
}
//上线或发布文章
export function changeBlogStatus(data){
    return fetch({
        url:`/oa/user/changeBlogStatus`,
        method:'post',
        data
    })
}
//删除 笔记本
export function  removeNote(data) {
    return fetch({
        url:`/oa/user/removeNote`,
        method:'post',
        data
    })
}

//修改笔记 本
export function modifyNote(data) {
    return fetch({
        url:'/oa/user/modifyNote',
        method:'post',
        data
    })
}

//识别文件
export function recognizeFile(data){
    return fetch({
        url:'/oa/user/recognizeFile',
        method:'post',
        data
    })
}

//删除标签
export function removeTag(data) {
    return fetch({
        url:`/oa/user/removeTag`,
        method:'post',
        data
    })
}
//修改标签
export function modifyTag (data) {
    return fetch({
        url: '/oa/user/modifyTag',
        method: 'post',
        data
    })
}


//查询标签详情
export function tagDetail (id) {
    return fetch({
        url:`/oa/user/tagDetail/${id}`,
        method:'get'
    })
}

//上传图片
export function upLoadImg(data){
    return fetch({
        url:'/oa/user/upFiles',
        method:'post',
        data
    })
}

//删除图片
export function removeImg(data){
    return fetch({
        url:'/oa/user/removeImg',
        method:'post',
        data
    })
}

export function getMyImg(params){
    return fetch({
        url:'/oa/user/myImg',
        method:'get',
        params
    })
}