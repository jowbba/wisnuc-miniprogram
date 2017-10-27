// pages/login/login.js
var app = getApp()
var utils = require('../../utils/util.js')
var { wxlogin, wxGetUserInfo, login, checkTicket, fillTicket} = utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'欢迎使用',
    state:'',
    userInfo: {},
    ticket: false,
    token: '',
    test: false,
    username:'',
    password:'',
    passwordConfirm:'',
    pulling:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tryLogin()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  updateStatus: function(message) {
    this.setData({status:message})
  },

  tryLogin: function() {
    let code, iv, encryptedData
    this.updateStatus('正在读取登录信息...')
    //获取code
    wxlogin().then(data => {
      console.log('wx-login 返回结果：', data)
      code = data.code
      this.updateStatus('正在读取用户信息...')
      //获取用户信息
      return wxGetUserInfo()
    }).then(result => {
      console.log('wx-getUserInfo 返回结果：', result)
      iv = result.iv
      encryptedData = result.encryptedData
      let userInfo = JSON.parse(result.rawData)
      app.userInfo = userInfo
      this.setData({ userInfo, status:'正在登录...' })
      let url = app.globalData.url + '/c/v1/token'
      //获取token
      return login(url, code, iv, encryptedData)
    }).then(loginResult => {
      console.log('登录结果：', loginResult)
      if (loginResult.statusCode == 200) {
        this.data.token = loginResult.data.data.token
        this.data.userid = loginResult.data.data.user.id
        this.updateStatus('当前微信用户没有被邀请或绑定硬件设备，请在App中绑定用户后进行操作-0')
        //处理ticket
        this.tryTicket()
      }else throw new Error('登录失败')
    }).catch(e => {
      console.log('错误信息： ', e)
      this.updateStatus('登录微信账号发生错误')
    })
  },

  tryTicket: function() {
    if (app.globalData.ticket) {
      //ticket存在
      let url = app.globalData.url + '/c/v1/tickets/' + app.globalData.ticket
      checkTicket(url, this.data.token).then(result => {
        console.log('检查ticket : ',result)
        if (result.data.code !== 200) {
          //用户已存在 
          if (result.data.code == 403) return this.setData({ 'status': result.data.message})
          //ticket是否无效
          if (result.data.code == 404) return this.setData({ 'status': '邀请码错误' })
          //ticket 是否过期
          if (result.data.message == 'ticket already expired') return this.setData({'status': '邀请已过期'})
        }
        if (result.data.data == null) {
          //ticket已使用
          this.updateStatus('邀请已完成')
          this.pullTicket(app.globalData.ticket,this.data.userid).then(ticketResult => {
            console.log('pull ticket', ticketResult)
            this.checketPullResult(ticketResult.data.data)
          })
        } else if (result.data.data.user) {
          //ticket已填写
          this.updateStatus('邀请已被接受，请等待确认')
          this.data.pulling = true
          this.pulling()
        }else {
          //ticket未使用
          this.setData({status:'',state:'wait'})
        }
      })
      
    }else {
      //ticket不存在
      this.updateStatus('当前微信用户没有被邀请或绑定硬件设备，请在App中绑定用户后进行操作-2')
      //todo login
    }
  },
  //填ticket
  submitTicket() {
    let url = app.globalData.url + '/c/v1/tickets/' + app.globalData.ticket + '/invite'
    let password = this.data.password
    let passwordConfirm = this.data.passwordConfirm
    if (password.length == 0) return wx.showModal({ title: '密码不能为空', showCancel:false}) 
    if (password !== passwordConfirm) return wx.showModal({ title: '两次密码不一致', showCancel: false } ) 
    fillTicket(url, password, this.data.token).then(data => {
      console.log(data)
      if (data.data.code == 403) return this.setData({ 'status': data.data.message, state:'' })
      this.setData({ status: '请在App中进行确认:' + app.globalData.ticket, state: '' })
      this.data.pulling = true
      this.pulling()
    }).catch(e => {
      console.log(e)
    })
  },
  //轮询ticket
  pulling() {
    if (!this.data.pulling) return
    this.pullTicket(app.globalData.ticket, this.data.userid).then(ticketResult => {
      console.log(ticketResult)
      this.checketPullResult(ticketResult.data.data)
      setTimeout(this.pulling, 5000)
    })
  },

  pullTicket(ticket,userid) {
    return new Promise((resolve,reject) => {
      wx.request({
        url: app.globalData.url + '/c/v1/tickets/' + ticket + '/users/' + userid,
        header: { Authorization: this.data.token },
        success: (result) => resolve(result),
        fail: err => reject(err)
      })
    })
  },
  //处理轮询结果
  checketPullResult(ticketResult) {
    this.data.pulling = false
    if (ticketResult.type == 'resolved') {
      this.updateStatus('你已被添加进群')
      //todo getGroup
    } else if (ticketResult.type == 'rejected') {
      this.updateStatus('你已被拒绝')
      //todo getGroup
    } else if (ticketResult.type == 'pending') {
      //nothing
      this.data.pulling = true
    }
  },

  getGroups() {

  },

  userTest: function() {
    this.setData({test: true})
  },

  inputUsername: function(e) {
    this.setData({username: e.detail.value})
  },

  inputPassword: function(e) {
    this.setData({ password: e.detail.value })
  },  

  inputPasswordConfirm: function(e) {
    this.setData({ passwordConfirm: e.detail.value })
  },

  testSubmit: function() {
    let userName = this.data.username
    let password = this.data.password
    console.log({ userName, password })
    wx.request({
      url: 'https://13151693.qcloud.la/test/mp/login',
      header: { Authorization: this.data.token},
      data:{userName, password},
      method: 'POST',
      success: (result) => {
        console.log(result)
        if (result.statusCode == 200) {
          this.setData({ test: false, status: '注册成功' })
        }else {
          this.setData({ test: false, status: result.data.message })
        }
        
      },
      fail: err => {
        console.log(err)
        this.setData({ test: false, status: '注册失败' })
      }
    })
  }
})