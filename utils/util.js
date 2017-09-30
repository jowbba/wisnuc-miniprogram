 function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function wxlogin() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.login({
        success: res => resolve(res),
        fail: err => reject(err)
      })
    },500)
  })
}

function wxGetUserInfo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.getUserInfo({
        withCredentials: true,
        success: res => resolve(res),
        fail: err => reject(err)
      })
    },500)
  })
}

function login(url,code, iv, encryptedData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.request({
        url: url,
        data: { code, iv, encryptedData },
        method: 'POST',
        success: (data, statusCode) => resolve(data),
        fail: err => reject(err)
      })
    },500)
  })
}

function checkTicket(url,token) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: { Authorization: token },
      success: (result) => resolve(result),
      fail: err => reject(err)
    })
  })
}

function fillTicket(url, password, token) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: { password: password },
      header: { Authorization: token },
      success: (result) => resolve(result),
      fail: err => reject(err)
    })
  })
}

module.exports = {
  formatTime: formatTime,
  wxlogin: wxlogin,
  wxGetUserInfo: wxGetUserInfo,
  login: login,
  checkTicket: checkTicket,
  fillTicket: fillTicket
}
