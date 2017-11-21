// pages/testLogin/testLogin.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    passwordConfirm: '',
    status : '',
    logined: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  inputUsername: function (e) {
    this.setData({ username: e.detail.value })
  },

  inputPassword: function (e) {
    this.setData({ password: e.detail.value })
  },

  inputPasswordConfirm: function (e) {
    this.setData({ passwordConfirm: e.detail.value })
  },

  testSubmit: function () {
    let userName = this.data.username
    let password = this.data.password
    console.log({ userName, password }, userName !== 'test' || password !== 'test')
    if (userName !== 'test' || password !== 'test') {
      return wx.showModal({ content: '用户名或密码错误', showCancel: false})
    }
    wx.showLoading({
      title: '正在注册',
    })
    wx.request({
      url: app.globalData.url + '/c/v1/account',
      header: { Authorization: this.data.token },
      data: { userName, password },
      method: 'POST',
      success: (result) => {
        console.log(getCurrentPages()[0].updateStatus('您已注册成功'))
        
        setTimeout(() => {
          wx.hideLoading()
        }, 800)
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        },1000)

      },
      fail: err => {
        console.log(err)
        this.setData({ logined: true, status: '注册成功' })
      }
    })
  }
})