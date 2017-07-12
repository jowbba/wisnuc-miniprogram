//app.js
App({
  onLaunch: function() {
    console.log('onLoad')
    let code, iv, encryptedData
    this.wxlogin().then(data => {
      console.log(data)
      code = data.code
      return this.wxGetUserInfo()
    }).then(result => {
      console.log(result)
      iv = result.iv
      encryptedData = result.encryptedData
      console.log(code)
      console.log(iv)
      console.log(encryptedData)
      wx.request({
        url: 'http://10.10.9.59:5757/v1/test/mp/checkLogin',
        data:{
          code:code,
          iv:iv,
          encryptedData: encryptedData
        },
        method: 'POST',
        success: (data, statusCode) => console.log(data, statusCode),
        fail: err => console.log(err),
        complete: () => console.log('complete')

      })
    })
  },

  wxlogin: function() {
    return new Promise((resolve,reject) => {
      wx.login({
        success: res => resolve(res),
        fail: err => reject(err)
      })
    })
  },
  
  wxGetUserInfo: function() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        success: res => resolve(res),
        fail: err => reject(err)
      })
    })
  },

  tryLogin: function() {

  },

  globalData: {
    userInfo: null
  }
})
