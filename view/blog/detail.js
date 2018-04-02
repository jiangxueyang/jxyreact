import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom'
import {inject, observer} from 'mobx-react'
import {Icon, Button, message} from 'antd'
import marked from 'marked'
import './detail.less'

@withRouter @inject('Blog', 'Filter') @observer
export default class extends Component {
    blog_id = this.props.match.params.blog_id
    
    async componentWillMount () {
        let {blog_id} = this, {Blog} = this.props
        await Blog.getNoteInfo()
        await Blog.getAllTag()
        await Blog.getBlogDetail(blog_id)
    }
    
    removeBlog = () => {
        let {Blog, history} = this.props, {blog_id} = this
        let callback = () => {
            message.success('删除成功！')
            history.replace('/')
        }
        Blog.deleteBlog(blog_id, callback)
    }
    
    render () {
        let {blog_id} = this
        let {Blog, Filter} = this.props
        let {tagList, blogDetail, allNoteInfo} = Blog
        let {title, content, create_time, note_id, tag_id} = blogDetail
        let {list: noteList} = allNoteInfo
        let note_list = Filter.formatTokey(noteList, 'id'),
            tag_list = Filter.formatTokey(tagList, 'id')
        
        
        return (
            <div className='blogDetail'>
                <h2 className="title tc">{title}</h2>
                <div className="baseInfo tc">
                    <span className="item"><Icon
                        type='calendar'></Icon>Posted on {Filter.formatTime(create_time, 'M d Y')}</span>
                    {note_id && <span className="item">
                        <Icon type="folder"/><Link
                        to={`/blogByNote/${note_id}`}>{note_list[note_id] && note_list[note_id]['name']}</Link>
                    </span>}
                    {tag_id.length > 0 && <span className="item">
                        <Icon type="tag"/>
                        {tag_id.map(e => {
                            return <Link to={`/blogByTag/${e}`} className='mr-10' key={e}>{tag_list[e] && tag_list[e]['name']}</Link>
                        })}
                    </span>}
                </div>
                <div className="blogContent" dangerouslySetInnerHTML={{__html: marked(content)}}></div>
                <div className="box">
                    <Button onClick={this.removeBlog}>删除</Button>
                    <Button onClick={() => {this.props.history.push(`/blog/edit/${blog_id}`)}}
                            type='primary'>编辑</Button>
                </div>
            </div>
        )
    }
}