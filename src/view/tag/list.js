import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import {Table, Modal, message, Button, Input} from 'antd'

@withRouter @inject('Blog', 'Filter') @observer
export default class extends Component {
    id = null
    state = {
        visible: false
    }
    columns = [
        {title: 'id', dataIndex: 'id'},
        {title: '标签名', dataIndex: 'name'},
        {
            title: '操作', dataIndex: 'operation', width: '140px', render: (value, record) => {
            return (
                <span className='operation'>
                    <Link to={`/blogByTag/${record.id}`}>查看</Link>
                    <a href="javascript:void(0)" onClick={() => {this.editTag(record)}}>编辑</a>
                    <a href="javascript:void(0)" onClick={() => {this.deleteTag(record)}}>删除</a>
                </span>
            
            )
        }
        },
    
    ]
    editTag = (record) => {
        let {name, id} = record, {Blog} = this.props
        Blog.tagForm.name = name
        
        this.id = id
        this.showModal()
        
    }
    addTag = async () => {
        let {id} = this, {Blog} = this.props
        let {tagStatus: status, tagErrs} = Blog
        if (status.submit) {
            await Blog.addTag(id)
            message.success(`${id ? '添加' : '修改'}成功！`)
            this.closeModal()
            await Blog.getAllTag()
        } else {
            message.error(tagErrs.name)
        }
        
        
    }
    deleteTag = (record) => {
        let {name, id} = record
        let {Blog} = this.props
        Modal.confirm({
            title: '提示',
            content: `确定删除标签${name}？`,
            async onOk () {
                await Blog.removeTag(id)
                message.success('删除成功！')
                await Blog.getAllTag()
                
            }
        })
    }
    showModal = () => {
        this.setState({visible: true})
    }
    closeModal = () => {
        this.setState({visible: false})
        this.props.Blog.tagForm.name = ''
        
    }
    changeName = (e) => {
        let value = e.target.value, key = e.target.name
        let data = {}
        data[key] = value
        let {Blog} = this.props
        Blog.setForm('tag', data)
        
    }
    
    async componentWillMount () {
        let {Blog} = this.props
        await Blog.getAllTag()
    }
    
    render () {
        let {Blog} = this.props
        let {tagList, tagForm} = Blog
        let data = tagList.map((e, i) => {
            return {...e, key: i}
        })
        return (
            <div id='tagList' className='tab-list'>
                <div className='record container'>共{data.length}条记录<Button type='primary' className='fr'
                                                                           onClick={this.showModal}>添加标签</Button></div>
                <Table columns={this.columns} dataSource={data} pagination={false} loading={Blog.loading}></Table>
                <Modal visible={this.state.visible} maskClosable={false} title={'添加笔记本'} onOk={this.addTag}
                       onCancel={this.closeModal}>
                    <Input name='name' placeholder='请输入笔记本名' value={tagForm.name} onChange={this.changeName}/>
                </Modal>
            </div>
        )
    }
}