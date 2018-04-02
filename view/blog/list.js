import React, {Component, Fragment} from 'react';
import {withRouter, Link} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import {Table, Pagination, message} from 'antd';

@withRouter @inject('Blog', 'Filter') @observer
class BlogList extends Component {
    columns = [
        {title: 'id', dataIndex: 'id', width: '50px'},
        {
            title: '标题', dataIndex: 'title', render: (text, record) => {
            let {type, url, id} = record
            type = Number(type)
            return (
                <Fragment>
                    {type === 0 && <Link to={`/blog/detail/${id}`}>{text}</Link>}
                    {type === 1 && <a href={url} target='_blank'>{text}</a>}
                </Fragment>
            )
        }
        },
        {
            title: '创建时间', dataIndex: 'create_time', width: '170px', render: (text) => {
            let {Filter} = this.props;
            return Filter.formatTime(text);
        }
        },
        {
            title: '修改时间', dataIndex: 'update_time', width: '170px', render: (text) => {
            let {Filter} = this.props;
            return Filter.formatTime(text);
        }
        },
        {
            title: '是否发布', dataIndex: 'publish', width: '90px', render: (value) => {
            return + value === 1 ? '是' : '否'
        }
        },
        {
            title: '操作', dataIndex: 'operation', width: '140px', render: (value, record) => {
            return (
                <span className='operation'>
                    <Link to={`/blog/edit/${record.id}`}>编辑</Link>
                    <a href="javascript:void(0)"
                       onClick={() => {this.changeStatus(record)}}>{! record.publish ? '发布' : '下线'}</a>
                    <a href="javascript:void(0)" onClick={() => {this.deleteBlog(record.id)}}>删除</a>
                </span>
            
            )
        }
        },
    ]
    pageNum = 1
    note_id = this.props.match.params.note_id
    tag_id = this.props.match.params.tag_id
    queryBlog = async () => {
        let {Blog} = this.props
        let {pageNum, note_id, tag_id} = this
        if (tag_id) {
            let params = {pageNum, tag_id}
            await Blog.getBlogInfoByTag(params)
            
        } else {
            let type = note_id ? 1 : 0
            let params = {pageNum, type, note_id};
            await Blog.getBlogInfo(params)
            
        }
        
        
    }
    changePage = (value) => {
        this.pageNum = value;
        this.queryBlog();
        
    }
    edit = (id) => {
        console.log(id, 'id')
        
    }
    deleteBlog = (id) => {
        let {Blog} = this.props, $this = this;
        let callback = () => {
            message.success('删除成功！');
            $this.queryBlog();
        }
        Blog.deleteBlog(id, callback)
    }
    changeStatus = async (record) => {
        let {id, publish} = record;
        publish = ! publish ? 1 : 0;
        let {Blog} = this.props;
        await Blog.changeBlogStatus({id, publish});
        message.success(`${publish === 1 ? '发布' : '下线'}成功！`);
        this.queryBlog();
        
    }
    
    componentWillMount () {
        let {note_id, tag_id} = this
        let {Blog} = this.props
        
        if (note_id) {
            Blog.getNoteDetail(note_id)
        }
        if (tag_id) {
            Blog.getTagDetail(tag_id)
        }
        this.queryBlog()
        
    }
    
    render () {
        let {Blog} = this.props, {note_id, tag_id} = this
        let {allBlogInfo, noteForm, tagForm, blogInfoByNote, blogInfoByTag} = Blog
        let info = {}
        if (tag_id) {
            info = blogInfoByTag
        } else {
            info = note_id ? blogInfoByNote : allBlogInfo
            
        }
        let {list = [], pageSize, total} = info;
        let data = list.map((e, i) => {
            return {...e, key: i}
        })
        return (
            <div id='blogList' className='tab-list'>
                <div className='record container'>
                    {note_id && `笔记本${noteForm.name}`}
                    {tag_id && `标签${tagForm.name}`}
                    共有{total}篇文章
                </div>
                <Table columns={this.columns} dataSource={data} pagination={false} loading={Blog.loading}></Table>
                <Pagination showQuickJumper defaultCurrent={this.pageNum} defaultPageSize={pageSize}
                            total={total} onChange={this.changePage}/>
            </div>
        )
    }
}

export default BlogList