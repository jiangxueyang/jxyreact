const config = {}

config.hosts = { admin: '//dev.admin.rsstu.com', api: '//dev.api.rsstu.com', res: '//dev.oss.rsstu.com' }
// this.hosts = { admin: '//admin.rsstu.com', api: '//api.rsstu.com', res: '//oss.rsstu.com' }
if (process.env.REACT_APP_API_ENV === 'local') {
  config.hosts = { admin: '//local.admin.rsstu.com', api: '//local.api.rsstu.com', res: '//local.oss.rsstu.com' }
  // this.hosts = { admin: '//dev.admin.rsstu.com', api: '//dev.api.rsstu.com', res: '//dev.oss.rsstu.com' }
}
if (process.env.REACT_APP_API_ENV === 'test') {
  config.hosts = { admin: '//test.admin.rsstu.com', api: '//test.api.rsstu.com', res: '//test.oss.rsstu.com' }
}

if (process.env.REACT_APP_API_ENV === 'prod') {
  config.hosts = { admin: '//admin.rsstu.com', api: '//api.rsstu.com', res: '//oss.rsstu.com' }
}

export default config