import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Button, Input, Row, Col, DatePicker, Select, Radio,message} from 'antd'
import {inject, observer} from 'mobx-react'
import './edit.less'
import domEvent from 'dom-events'

const Option = Select.Option
const RadioGroup = Radio.Group

@withRouter @inject('Blog') @observer
class Edit extends Component {
    blog_id = this.props.match.params.blog_id
    state = {
        errInfo: {}
    }
    changeInput = (e) => {
        let target = e.target
        
        let {name: key, value} = target
        this.changeForm(key, value)
        
    }
    changeForm = (key, value) => {
        let formObj = {}, {Blog} = this.props
        formObj[key] = value
        Blog.setForm('blogEdit', formObj)
        let {blogEditErrs} = Blog
        this.setState({errInfo: blogEditErrs})
        
    }
    addFile = async (e) => {
        let target = e.target, {Blog} = this.props
        let files = target.files
        if (files.length > 0) {
            let file = files[0]
            let formData = new FormData()
            formData.append('userfile', file)
            await Blog.recognizeFile(formData)
            document.querySelector('#addFile').value = null
            
        }
    }
    emitInput = () => {
        domEvent.emit(document.querySelector('#addFile'), 'click');
        
    }
    clearAll = () => {
        let {Blog} = this.props
        Blog.reductionBlogEit()
        this.setState({errInfo: {}})
        
    }
    submit = async () => {
        let {Blog} = this.props,{blog_id} = this
        let res = await Blog.addBlog(blog_id)
        if(res){
            let {id} = res
            message.success(`${blog_id?'修改':'添加'}成功！`)
            this.clearAll()
            id = id || blog_id
            this.props.history.replace(`/blog/detail/${id}`)
        }
    }
    
    async componentWillMount () {
        let {Blog} = this.props,{blog_id} = this
        await Blog.getNoteInfo()
        await Blog.getAllTag()
        if(blog_id){
            await Blog.getBlogDetail(blog_id)
        }else{
            this.clearAll()
        }
    }
    
    render () {
        let {Blog} = this.props, {state} = this
        let {blogEditForm, allNoteInfo, tagList, blogEditStatus: status} = Blog, {TextArea} = Input, {errInfo} = state
        let {list: noteList} = allNoteInfo
        return (
            <div id='edit'>
                <form>
                    <Row gutter={20}>
                        <Col span={4} className='tr required label'>标题</Col>
                        <Col span={12}><Input name='title' placeholder='请输入标题' value={blogEditForm.title}
                                              onChange={this.changeInput} onBlur={this.changeInput}/></Col>
                        <Col span={4} className='error'>{errInfo.title}</Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4} className='tr required label'>简介</Col>
                        <Col span={12}><TextArea name='brief' placeholder='请输入简介' className='brief'
                                                 value={blogEditForm.brief} onBlur={this.changeInput}
                                                 onChange={this.changeInput}/></Col>
                        <Col span={4} className='error'>{errInfo.brief}</Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4} className='tr label'>创建时间</Col>
                        <Col span={12}>
                            <DatePicker name='create_time' onChange={(e) => {this.changeForm('create_time', e)}}
                                        formate='YYYY-MM-DD' value={blogEditForm.create_time}></DatePicker>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4} className='tr required label'>笔记本</Col>
                        <Col span={12}>
                            <Select name='note_id' placeholder='请选择笔记本'
                                    onChange={(e) => {this.changeForm('note_id', e)}} style={{width: 150}}
                                    value={blogEditForm.note_id}>
                                {
                                    noteList.map(e => {
                                        return <Option value={e.id} key={e.id}>{e.name}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4} className='error'>{errInfo.note_id}</Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4} className='tr required label'>标签</Col>
                        <Col span={14}>
                            <Select name='tag_id' placeholder='请选择标签' value={blogEditForm.tag_id.slice()}
                                    mode="multiple" onChange={(e) => {this.changeForm('tag_id', e)}}
                                    style={{width: '100%'}}>
                                {
                                    tagList.map(e => {
                                        return <Option value={e.id} key={e.id}>{e.name}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4} className='error'>{errInfo.tag_id}</Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4} className='tr required label'>是否发布</Col>
                        <Col span={20}>
                            <RadioGroup name='publish' onChange={this.changeInput} value={blogEditForm.publish}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                            <Col span={4} className='error'>{errInfo.publish}</Col>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4} className='tr required label'>内容</Col>
                        <Col span={4}>
                            <Button type='primary' onClick={this.emitInput}>上传文件</Button>
                            <input type="file" name="source" onChange={this.addFile} id="addFile"/>
                        </Col>
                        <Col span={4} className='error'>{errInfo.content}</Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4}></Col>
                        <Col span={18}>
                            <TextArea name='content' className='blogContent' value={blogEditForm.content}
                                      placeholder='请输入内容' onChange={this.changeInput}
                                      onBlur={this.changeInput}></TextArea>
                        </Col>
                    </Row>
                </form>
                <div className="box tc">
                    <Button onClick={this.clearAll} className='mlr-10'>清空</Button>
                    <Button type='primary' onClick={this.submit} className='mlr-10'
                            disabled={! status.submit || status.loading}>提交</Button>
                </div>
            </div>
        )
    }
}

export default Edit