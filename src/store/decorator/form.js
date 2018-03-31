import { action } from 'mobx'
import Validator from "@/plugin/formValidator";
import XSS from 'xss'


const whiteList = XSS.whiteList
whiteList.embed = ['src', 'allowfullscreen', 'quality', 'width', 'height', 'align', 'type', 'allowscriptaccess']
Object.keys(whiteList).forEach(key => {
    whiteList[key].push('style')
})
const xss = new XSS.FilterXSS({ whiteList })
export default function (target) {
    target.prototype.xss = xss
    target.prototype.isSubmit = function (name) {
        let isSubmit = true
        const form = this[`${name}Form`]
        const status = this[`${name}Status`]
        const errs = this[`${name}Errs`]
        let rules = this[`${name}Rules`]
        const fields = this[`${name}FormFields`]
        if (!rules && fields) {
            rules = {}
            fields.forEach((item) => {
                if (item.rules) {
                    rules[item.field] = { rules: item.rules, aliasName: item.aliasName || item.title }
                }
            })
        }
        if (typeof status === 'object' && typeof form === 'object') {
            const errKeys = typeof errs === 'object' ? Object.keys(errs) : []
            for (let i = 0; i < errKeys.length; i += 1) {
                if (errs[errKeys[i]]) {
                    isSubmit = false
                    break
                }
            }
            const ruleKeys = typeof rules === 'object' ? Object.keys(rules) : []
            for (let i = 0; i < ruleKeys.length; i += 1) {
                const tmpKey = ruleKeys[i]
                const tmpRules = rules[tmpKey] ? rules[tmpKey].rules || '' : ''
                if (tmpRules.indexOf('required') >= 0 && (typeof form[tmpKey] === undefined || form[tmpKey] === '')) {
                    isSubmit = false
                    break
                }
            }
            status.submit = isSubmit
        }
    }
    
    target.prototype.setForm = action(function (name, formObj) {
        const form = this[`${name}Form`]
        let rules = this[`${name}Rules`]
        const fields = this[`${name}FormFields`]
        if (!rules && fields) {
            rules = {}
            fields.forEach((item) => {
                if (item.rules) {
                    rules[item.field] = { rules: item.rules, aliasName: item.aliasName || item.title }
                }
            })
        }
        const errs = this[`${name}Errs`]
        Object.keys(formObj).forEach((key) => {
            let tmpValue = formObj[key]
            if (form && typeof form[key] !== 'undefined') {
                form[key] = (typeof tmpValue === 'string' && key !== 'content') ? xss.process(tmpValue) : tmpValue
            }
            if (rules && rules[key] && errs && typeof errs[key] !== 'undefined') {
                errs[key] = Validator.check(tmpValue, rules[key])
            }
        })
        this.isSubmit(name)
    })
    
    
    target.prototype.outHtml = function (content) {
        return { __html: xss.process(content) }
    }
    
    // 获取表单配置的字段
    target.prototype.getUrlParamsFieldArr = function ({ page = false, formName = 'list' } = {}) {
        const listForm = this[`${formName}Form`]
        const listFormsConf = this[`${formName}FormsConf`]
        if (typeof listForm !== 'object') {
            return []
        }
        let fieldArr = []
        if (typeof listFormsConf === 'object') {
            if (page) {
                fieldArr.push('page', 'pageSize')
            }
            const type = listForm._queryType
            const fields = listFormsConf[type] ? listFormsConf[type].fields || [] : []
            
            for (let i = 0; i < fields.length; i += 1) {
                const fieldObj = fields[i]
                if (fieldObj.field.indexOf(',') > 0) {
                    fieldArr = fieldArr.concat(fieldObj.field.split(','))
                } else {
                    fieldArr.push(fieldObj.field)
                }
            }
        } else {
            if (page) {
                fieldArr = fieldArr.concat(Object.keys(listForm))
            } else {
                const tmpObj = Object.assign({}, listForm)
                delete tmpObj.page
                delete tmpObj.pageSize
                fieldArr = fieldArr.concat(Object.keys(tmpObj))
            }
        }
        
        return fieldArr
    }
    
    // 根据配置字段 生成对应的查询URL
    target.prototype.getUrlParamsStr = function ({ formName = 'list', page = false, sorter = false } = {}) {
        if (typeof this[`${formName}Form`] !== 'object') {
            return ''
        }
        let searchParams = {}
        if (process.browser) {
            searchParams = new URLSearchParams()
        } else {
            const { URLSearchParams } = require('url');
            searchParams = new URLSearchParams()
        }
        const fieldArr = this.getUrlParamsFieldArr({ formName })
        fieldArr.push('_queryType')
        if (page) {
            fieldArr.push('page', 'pageSize')
        }
        if (sorter) {
            fieldArr.push('_sorterField', '_sorterVal')
        }
        for (let j = 0; j < fieldArr.length; j += 1) {
            const field = fieldArr[j]
            const value = this[`${formName}Form`][field]
            if (!(typeof value === 'undefined' || value === '')) {
                searchParams.set(field, value)
            }
        }
        return searchParams.toString()
    }
    
    // 根据URL 设置字段
    target.prototype.urlSetForm = function (formName = 'list', str = '') {
        const dfFormName = `df${formName.replace(/^\S/, s => s.toUpperCase())}Form`
        const dfFormObj = this[dfFormName] || {}
        if (dfFormObj) {
            this.setForm(formName, dfFormObj)
        }
        const formObj = this[`${formName}Form`]
        if (typeof formObj === 'object') {
            let searchParams = {}
            if (process.browser) {
                searchParams = new URLSearchParams(str.replace(/$\?/, ''))
            } else {
                const { URLSearchParams } = require('url');
                searchParams = new URLSearchParams(str.replace(/$\?/, ''))
            }
            Object.keys(formObj).forEach((key) => {
                if (searchParams.has(key)) {
                    formObj[key] = xss.process(searchParams.get(key))
                }
            })
        }
    }
    
    // 查查 from 是否存在
    target.prototype.checkForm = function ({ formName = 'detail', url = '' } = {}) {
        if (!url) {
            return { errno: 403004, errmsg: 'URL不能为空' }
        }
        const form = this[`${formName}Form`]
        const status = this[`${formName}Status`]
        if (!form || !status) {
            return { errno: 403004, errmsg: '找不到对应的 Form 或者' }
        }
        return { errno: 0, form, status }
    }
}