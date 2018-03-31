const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日']

export function datetime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return ''
  }
  let tempDate = date
  if (tempDate.length === 10) {
    tempDate += ' 00:00:00'
  }
  tempDate = (typeof tempDate === 'string') ? new Date(tempDate.replace(/-/g, '/')) : new Date(tempDate)
  if (isNaN(Date.parse(tempDate))) {
    return 'Invalid Date'
  }
  const year = tempDate.getFullYear()
  const month = tempDate.getMonth() + 1
  const week = tempDate.getDay()
  const day = tempDate.getDate()
  const hours = tempDate.getHours()
  const minutes = tempDate.getMinutes()
  const seconds = tempDate.getSeconds()

  const tempObj = {
    YYYY: year,
    W: weekArr[week],
    MM: month > 9 ? month : `0${month}`,
    DD: day > 9 ? day : `0${day}`,
    HH: hours > 9 ? hours : `0${hours}`,
    mm: minutes > 9 ? minutes : `0${minutes}`,
    ss: seconds > 9 ? seconds : `0${seconds}`
  }
  let dateText = format
  if (dateText === 'auto') {
    const nowDate = new Date()
    const toDayTime = new Date(`${nowDate.getFullYear()}/${nowDate.getMonth() + 1}/${nowDate.getDate()}`)
    const currentYearTime = new Date(`${nowDate.getFullYear()}`)
    if (tempDate.getTime() > toDayTime.getTime()) {
      dateText = 'HH:mm'
    } else if (tempDate.getTime() > currentYearTime.getTime()) {
      dateText = 'MM-DD HH:mm'
    } else {
      dateText = 'YYYY-MM-DD HH:mm'
    }
  }

  Object.keys(tempObj).forEach((key) => {
    dateText = dateText.replace(key, tempObj[key])
  })
  return dateText
}

export function week(index) {
  return weekArr[index] ? weekArr[index] : ''
}

