import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import {Table, Pagination, message, Button, Modal} from 'antd'
import domEvent from 'dom-events'

@withRouter @inject('Blog', 'Filter') @observer
export default class extends Component {
    pageNum = 1
    columns = [
        {title: 'id', dataIndex: 'id'},
        {
            title: '图片', dataIndex: 'name', render: (text) => {
            let imgPath = `http://img.jiangxy.cn/${text}`
            return (
                <img src={imgPath} onClick={()=>{this.showImg(imgPath)}} className='up-img' alt="图片"/>
            )
        }
        },
        {
            title: '操作', dataIndex: 'operation', width: '140px', render: (text, record) => {
            return (
                <span className='operation'>
                    <a href="javascript:void(0)"
                       onClick={() => {this.copyPath(`http://img.jiangxy.cn/${record.name}`)}}>复制</a>
                    <a href="javascript:void(0)" onClick={() => {this.deleteImg(record.name)}}>删除</a>
                </span>
            )
        }
        }
    ]
    imgNode = (imgPath) => {
        return (
            <img src={imgPath} alt=""/>
        )
    }
    showImg = (imgPath) => {
        let imgNode = this.imgNode(imgPath)
        Modal.success({
            iconType:'aa',
            maskClosable:true,
            content:imgNode
        })
    }
    deleteImg = (name) => {
        let {Blog} = this.props, $this = this
        Modal.confirm({
            title: '提示',
            content: '确定删除此图片？',
            async onOk () {
                await Blog.deleteImg(name)
                message.success('删除成功！')
                $this.queryImgInfo()
                
            }
        })
        
    }
    clipboard = () => {
        let clipboard;
        try {
            clipboard = require('clipboard-polyfill');
        } catch (e) {
            clipboard = require('clipboard-js');
            clipboard.writeText = clipboard.copy;
        }
        return clipboard;
    }
    changePage = (value) => {
        this.pageNum = value
        this.queryImgInfo()
        
    }
    copyPath = (path) => {
        try {
            let clipboard = this.clipboard();
            clipboard.writeText(path);
            message.success('复制成功！')
        } catch (e) {
        
        }
        
    }
    triggerUp = () => {
        domEvent.emit(document.querySelector('#addFile'), 'click');
    }
    
    addFile = async (e) => {
        let target = e.target, {Blog} = this.props
        let files = target.files
        if (files.length > 0) {
            let file = files[0]
            let formData = new FormData()
            formData.append('userfile', file);
            document.querySelector('#addFile').value = null
            await Blog.uploadImg(formData)
            message.success('上传成功')
            this.queryImgInfo()
            
        }
    }
    queryImgInfo = () => {
        let {Blog} = this.props, {pageNum} = this
        Blog.getImgInfo({pageNum})
    }
    
    componentWillMount () {
        this.queryImgInfo()
    }
    
    render () {
        let {Blog} = this.props
        let {imgInfo} = Blog
        let {total, list, pageSize} = imgInfo
        let data = list.map((e, i) => {
            return {...e, key: i}
        })
        return (
            <div id='imgList' className='tab-list'>
                <div className="record container">
                    共有{total}条记录
                    <Button type='primary' className='fr' onClick={this.triggerUp}>上传图片</Button>
                    <input type="file" name="source" accept="image/gif, image/jpeg,image/jpg,image/png,image/svg,image/vnd.microsoft.icon"
                           onChange={this.addFile} id="addFile"/>
                </div>
                <Table columns={this.columns} dataSource={data} pagination={false} loading={Blog.loading}></Table>
                <Pagination showQuickJumper defaultCurrent={this.pageNum} defaultPageSize={pageSize}
                            total={total} onChange={this.changePage}/>
            
            </div>
        )
    }
}

