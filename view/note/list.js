import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import {Table, Pagination, Modal, message, Button, Input} from 'antd';

@withRouter @inject('Blog', 'Filter') @observer
export default class extends Component {
    pageNum = 1
    id = null
    state = {
        visible: false
    }
    columns = [
        {title: 'id', dataIndex: 'id'},
        {title: '笔记本名', dataIndex: 'name'},
        {
            title: '操作', dataIndex: 'operation', width: '140px', render: (value, record) => {
            return (
                <span className='operation'>
                    <Link to={`/blogByNote/${record.id}`}>查看</Link>
                    <a href="javascript:void(0)" onClick={() => {this.editNote(record.id)}}>编辑</a>
                    <a href="javascript:void(0)" onClick={() => {this.deleteNote(record.id)}}>删除</a>
                </span>
            
            )
        }
        },
    
    ]
    editNote = async (id) => {
        let {Blog} = this.props
        await Blog.getNoteDetail(id);
        this.id = id;
        this.showModal();
        
    }
    deleteNote = async (id) => {
        let {Blog} = this.props, $this = this
        Modal.confirm({
            title: '提示',
            content: '删除笔记本将会删除笔记本里所有的文章，确认删除？',
            async onOk () {
                await Blog.removeNote(id);
                message.success('删除成功！')
                $this.queryNote();
            }
        })
        
    }
    queryNote = async () => {
        let {Blog} = this.props
        let {pageNum} = this
        await Blog.getNoteInfo({pageNum, type: 1})
    }
    changePage = (value) => {
        this.pageNum = value
        this.queryNote()
        
    }
    submit = async () => {
        let {Blog} = this.props
        let {noteStatus, noteErrs} = Blog
        if (noteStatus.submit) {
            let {id} = this;
            await Blog.addNote(id)
            this.closeModal();
            message.success(`${id ? '修改' : '添加'}成功！`)
            this.queryNote()
            
        } else {
            message.error(noteErrs.name)
        }
    }
    addNote = () => {
        this.id = null
        this.showModal()
    }
    showModal = () => {
        this.setState({visible: true})
        
    }
    closeModal = () => {
        this.setState({visible: false})
        this.props.Blog.noteForm.name = ''
        
    }
    changeName = (e) => {
        let value = e.target.value, key = e.target.name
        let data = {}
        data[key] = value
        let {Blog} = this.props
        Blog.setForm('note', data)
    }
    
    componentWillMount () {
        let {Blog} = this.props
        Blog.noteStatus.submit = false
        this.queryNote()
        
    }
    
    render () {
        let {Blog} = this.props
        let {noteInfoByPage, noteForm} = Blog
        let {list = [], total, pageSize} = noteInfoByPage
        let data = list.map((e, i) => {
            return {...e, key: i}
        })
        return (
            <div id='noteList' className='tab-list'>
                <div className='record container'>共{total}条记录<Button type='primary' className='fr'
                                                                     onClick={this.addNote}>添加笔记本</Button></div>
                <Table columns={this.columns} dataSource={data} pagination={false} loading={Blog.loading}></Table>
                <Pagination showQuickJumper defaultCurrent={this.pageNum} defaultPageSize={pageSize}
                            total={total} onChange={this.changePage}/>
                <Modal visible={this.state.visible} maskClosable={false} title={'添加笔记本'} onOk={this.submit}
                       onCancel={this.closeModal}>
                    <Input name='name' placeholder='请输入笔记本名' value={noteForm.name} onChange={this.changeName}/>
                </Modal>
            
            </div>
        )
    }
}