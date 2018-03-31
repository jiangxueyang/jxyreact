import {observable, action} from 'mobx'
import * as api from '@/api';
import Form from './decorator/form'
import {Modal} from 'antd'
import moment from 'moment'

@Form
class BlogStore {
    @observable allBlogInfo = {list: [], total: 0, pageSize: 10}
    @observable blogInfoByNote = {list: [], total: 0, pageSize: 10}
    @observable blogInfoByTag = {list: [], total: 0, pageSize: 10}
    @observable noteInfoByPage = {list: [], total: 0, pageSize: 10}
    @observable allNoteInfo = {list: [], total: 0, pageSize: 10}
    @observable imgInfo = {list:[],total:0,pageSize:10}
    @observable loading = false
    @observable noteForm = {name: ''}
    @observable noteErrs = {name: ''}
    @observable noteStatus = {submit: false, loading: false}
    
    @observable noteRules = {
        name: {rules: 'required|noteOrTag', aliasName: '笔记本'},
    }
    @observable tagForm = {name: ''}
    @observable tagErrs = {name: ''}
    @observable tagStatus = {submit: false, loading: false}
    
    @observable tagRules = {
        name: {rules: 'required|noteOrTag', aliasName: '标签'},
    }
    
    
    @observable blogEditForm = {
        title: '',
        brief: '',
        tag_id: [],
        content: '',
        create_time: moment(),
        note_id: '',
        publish: 0,
        origin_tag_id: []
        
    }
    @observable blogEditErrs = {title: '', brief: '', tag_id: '', content: '', create_time: '', note_id: ''}
    @observable blogEditRules = {
        title: {rules: 'required', aliasName: '标题'},
        brief: {rules: 'required', aliasName: '简介'},
        content: {rules: 'required', aliasName: '内容'},
        note_id: {rules: 'required', aliasName: '笔记本'},
        tag_id: {rules: 'tagIdNotEmpty', aliasName: '标签'},
        publish: {rule: 'required', aliasName: '是否发布'}
    }
    @observable blogEditStatus = {submit: false, loading: false}
    
    @observable tagList = []
    
    @observable blogDetail = {content: '', title: '', tag_id: [], note_id: '', create_time: ''}
    
    
    @action
    async getBlogInfo (params) {
        let type = params.type || 0
        let key = type === 0 ? 'allBlogInfo' : 'blogInfoByNote'
        let {pageSize} = this[key]
        params = {...params, pageSize, loading: false}
        this.loading = true
        let res = await api.myBlogList(params).finally(_ => {
            this.loading = false
        })
        this[key] = res;
    }
    
    @action
    async getBlogInfoByTag (params) {
        let {blogInfoByTag} = this
        let {pageSize} = blogInfoByTag
        params = {...params, pageSize,loading:false}
        this.loading = true
        let res = await api.blogByTag(params).finally(_ => {
            this.loading = false
        })
        this.blogInfoByTag = res
    }
    
    @action
    async deleteBlog (id, callback) {
        Modal.confirm({
            title: '提示',
            content: '确认删除此文章？',
            async onOk () {
                await api.removeBlog({id});
                if (typeof callback === 'function') {
                    callback()
                }
                
                
            }
        })
    }
    
    @action
    async changeBlogStatus (data) {
        await api.changeBlogStatus(data)
    }
    
    
    @action
    async getBlogDetail (id) {
        let res = await api.blogDetail(id)
        this.blogDetail = res;
        let {create_time, note_id, tag_id} = res
        create_time = moment(create_time)
        this.blogEditForm = {...res, create_time, note_id: Number(note_id), origin_tag_id: tag_id}
        this.blogEditStatus.submit = true
        
    }
    
    @action
    async reductionBlogEit () {
        this.blogEditForm = {
            title: '',
            brief: '',
            tag_id: [],
            content: '',
            create_time: moment(),
            note_id: '',
            publish: 0
        }
        this.blogEditStatus = {submit: false, loading: false}
    }
    
    @action
    async recognizeFile (data) {
        let res = await api.recognizeFile(data)
        this.blogEditForm.content = res
        
    }
    
    @action
    async addBlog (id) {
        let {blogEditForm, blogEditStatus: status} = this
        if (status.submit) {
            let {create_time, note_id, title, content, tag_id, brief, publish, origin_tag_id} = blogEditForm
            if (create_time) {
                let format_time = create_time.format('YYYY-MM-DD hh:mm:ss')
                let data = {note_id, title, content, tag_id, brief, create_time: format_time, publish}
                status.loading = true
                let func = 'addBlog'
                if (id) {
                    data['id'] = id
                    data['origin_tag_id'] = origin_tag_id
                    func = 'modifyBlog'
                }
                let res = await api[func](data).finally(_ => {
                    status.loading = false
                })
                
                return res
            }
        }
        
    }
    
    @action
    async getNoteInfo (params) {
        params = params || {}
        let type = params.type || 0
        let key = type === 0 ? 'allNoteInfo' : 'noteInfoByPage'
        let {pageSize} = this[key]
        params = {...params, pageSize, loading: false}
        this.loading = true
        let res = await api.myNoteList(params).finally(_ => {
            this.loading = false
        })
        this[key] = res
    }
    
    @action
    async addNote (id) {
        let {noteForm} = this
        let {name} = noteForm
        this.loading = true
        let func = 'addNote', data = {name}
        if (id) {
            func = 'modifyNote'
            data['id'] = id
        }
        
        await api[func](data).finally(_ => {
            this.loading = false
        })
    }
    
    
    @action
    async getNoteDetail (id) {
        let res = await api.noteDetail(id)
        this.noteForm.name = res.name
        this.noteStatus.submit = true
    }
    
    
    @action
    async removeNote (id) {
        await api.removeNote({id})
    }
    
    @action
    async getAllTag () {
        this.loading = true
        let res = await api.tagList({loading: false}).finally(_ => {
            this.loading = false
        })
        this.tagList = res;
    }
    
    @action
    async removeTag (id) {
        await api.removeTag({id})
    }
    
    @action
    async addTag (id) {
        let {tagForm, tagStatus: status} = this
        let {name} = tagForm
        let data = {name}, func = 'addTag'
        if (id) {
            data['id'] = id
            func = 'modifyTag'
        }
        status.loading = true
        await api[func](data).finally(_ => {
            status.loading = false
        })
    }
    
    @action
    async getTagDetail (id) {
        let res = await api.tagDetail(id)
        this.tagForm = {name: res.name}
    }
    
    @action
    async getImgInfo(params){
        let {imgInfo} = this
        let {pageSize} = imgInfo
        params = {...params,pageSize,loading:false}
        this.loading = true
        let res = await api.getMyImg(params).finally(_=>{
            this.loading = false
        })
        this.imgInfo = res
        
    }
    
    @action
    async uploadImg(data){
        await api.upLoadImg(data)
    }
    
    @action
    async deleteImg(name){
        await api.removeImg({name})
    
    }
    
}

export default BlogStore