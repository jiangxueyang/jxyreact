class Validator {
    constructor () {
        this.regs = {
            name: /^[a-zA-Z0-9\-\u4e00-\u9fa5]{6,16}$/,
            phone: /(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}$|170[0589]\d{7}$/,
            mail: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            password: /[\w\d~'!@#￥$%^&*|{}\][)(-?"+_=:`]{6,32}/,
            captcha: /[\d]{6}/,
            imgCaptcha: /[\d\w]{4}/,
            noteName:/^[a-zA-Z0-9\-\u4e00-\u9fa5]{2,16}$/,
            url:/^((http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)$/
        }
        this.errMsg = {
            required: '{name}不能为空',
            nameOrPhoneOrMail: '用户名/手机/邮箱 格式不正确',
            phoneOrMail: '手机/邮箱 格式不正确',
            password: '密码 格式不正确',
            imgCaptcha: '图形验证码为四位数字/字母组合',
            captcha: '验证码 必须为六位数字',
            phone: '手机 格式不正确',
            mail: '邮箱 格式不正确',
            noteOrTag:'{name}格式不正确',
            tagIdNotEmpty:'标签不能为空',
            url:'链接格式不正确'
        }
        this.rules = {
            required (value) {
                return ! (value === null || value === undefined || value === '')
            },
            
            tagIdNotEmpty (value){
                return value.length > 0
            },
            noteOrTag (value){
                const isNote = this.regs.noteName.test(value)
                return isNote
                
            },
            nameOrPhoneOrMail (value) {
                const isName = this.regs.name.test(value)
                const isPhone = this.regs.phone.test(value)
                const isMail = this.regs.mail.test(value)
                return isName || isPhone || isMail
            },
            phoneOrMail (value) {
                const isPhone = this.regs.phone.test(value)
                const isMail = this.regs.mail.test(value)
                return isPhone || isMail
            },
            phone (value) {
                return this.regs.phone.test(value)
            },
            mail (value) {
                return this.regs.mail.test(value)
            },
            imgCaptcha (value) {
                return this.regs.imgCaptcha.test(value)
            },
            captcha (value) {
                return this.regs.captcha.test(value)
            },
            password (value) {
                return this.regs.password.test(value)
            },
            url(value){
                return this.regs.url.test(value)
            }
        }
    }
    
    check (value, ruleObj) {
        let err = ''
        const ruleArr = ruleObj.rules.split('|')
        for (let i = 0; i < ruleArr.length; i += 1) {
            const tmpRule = ruleArr[i]
            const tmpFn = this.rules[tmpRule]
            if (typeof tmpFn === 'function') {
                if (! tmpFn.call(this, value)) {
                    err = this.errMsg[tmpRule]
                    err = err.replace('{name}', ruleObj.aliasName || '')
                    break
                }
            }
        }
        return err
    }
}


export default new Validator()