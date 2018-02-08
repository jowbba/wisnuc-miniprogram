var Base64 = require('./base64.js')
var base64 = new Base64()
var errCodeObj = {
  60001: '用户已存在',
  60200: '邀请码错误',
  60202: '邀请码已过期',
  60204: '您已申请过加入设备，无需重复提交'
}

function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  let d1 = [year, month, day].map(formatNumber).join('/')
  let d2 = [hour, minute, second].map(formatNumber).join(':')
  return d1 + ' ' + d2
  let today = new Date()
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatSize(size) {
  if (size < 1024) return size + 'B'
  else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB' 
  else if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + 'MB'
  else if (size < 1024 * 1024 * 1024 * 1024) return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
}

// 返回URL, TOKEN
function getReqParams() {
  let data = getApp().globalData
  return { token: data.token, url: data.url, 
    stationId: data.currentGroup ? data.currentGroup.stationId : null}
}

// 微信登录API
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

// 微信获取用户信息API
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

// 登录获取token
function login(url,code, iv, encryptedData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.request({
        url: url,
        data: { code, iv, encryptedData },
        method: 'POST',
        success: res => {
          console.log(res)
          if (res.statusCode !== 200) reject(res.data)
          else resolve(res)
        },
        fail: err => reject(err)
      })
    },500)
  })
}

// 查询ticket信息
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

// 填写ticket
function fillTicket(url, token) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      // data: { password: password },
      header: { Authorization: token },
      success: (result) => resolve(result),
      fail: err => reject(err)
    })
  })
}

// 判断错误类型
function getErrorMessage(errCode) {
  let message = errCodeObj[errCode]
  if (message) return message
  else return errCode + '： 未知错误'
}

// 获取群列表 （测试用）
function getGroupList() {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      // return reject('....')
      resolve([
        {
          "uuid": "126d9a28-0e7f-4573-b69b-80c032ed4b25",
          "name": "w",
          "owner": "b2524869-cc25-4c08-b480-a8ab8080c4b2",
          "users": [
            "b2524869-cc25-4c08-b480-a8ab8080c4b2"
          ],
          "ctime": 1516356443977,
          "mtime": 1516604715756
        },
        {
          "uuid": "f15b7003-b6c0-4243-95f5-062d7798c25e",
          "name": "test",
          "owner": "b2524869-cc25-4c08-b480-a8ab8080c4b2",
          "users": [
            "b2524869-cc25-4c08-b480-a8ab8080c4b2"
          ],
          "ctime": 1516354959168,
          "mtime": 1516355017981
        }
      ])
    }, 200)
  })
}

// 获取群列表
function getBox(id) {
  return new Promise((resolve, reject) => {
    let { url, token } = getReqParams()
    url += '/c/v1/boxes'
    if (id) url += '/' + id
    wx.request({
      url: url,
      header: { Authorization: token },
      success: res => {
        if (res.statusCode !== 200) reject(res.data)
        else resolve(res.data.data)
      },
      fail: res => {
        console.log(res)
        reject(res)
      } 
    })
  })
}

// 获取tweets
function getTweets() {
  return new Promise((resolve, reject) => {
    let { url, token } = getReqParams()
    wx.request({
      url: url + '/c/v1/tweets',
      success: res => {
        if (res.statusCode !== 200) reject(res.data)
        else resolve(res.data)
      },
      fail: res => {
        console.log(res)
        reject(res)
      } 
    })
  })
}

function stationJson(api, method, params) {
  let { url, token, stationId } = getReqParams()
  let resourceStr = base64.encode(api)
  let reqUrl = url + '/c/v1/stations/' + stationId + '/json?method=' + method
  reqUrl += ('&resource=' + resourceStr)
  for (let item in params) {
    reqUrl += ('&' + item + '=' + params[item])
  }
  console.log(reqUrl)
  return new Promise((resolve, reject) => {
    wx.request({
      url: reqUrl,
      header: { Authorization: token },
      success: res => {
        if (res.statusCode !== 200) reject(res.data)
        else resolve(res.data.data)
      },
      fail: res => {
        console.log(res)
        reject(res)
      } 
    })
  })
}

function stationDownload(api, params) {

}

module.exports = {
  formatTime,
  formatSize,
  wxlogin,
  wxGetUserInfo,
  login,
  checkTicket,
  fillTicket,
  getErrorMessage,
  getGroupList,
  getBox,
  getTweets,
  stationJson
}
