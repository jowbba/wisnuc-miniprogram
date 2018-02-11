// pages/login/login.js
var app = getApp()
var utils = require('../../utils/util.js')
var { wxlogin, wxGetUserInfo, login, checkTicket, fillTicket, getErrorMessage} = utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'欢迎使用',
    state:'',
    ticket: false,
    userInfo: {},
    user: '',
    token: '',
    creatorInfo: {},
    test: false,
    pulling:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tryLogin()
  },

  // 更新状态
  updateStatus: function(message) {
    this.setData({status:message})
  },

  // 跳转到测试账号
  userTest: function () {
    wx.navigateTo({ url: '../testLogin/testLogin' })
  },

  // 登录
  tryLogin: function() {
    let code, iv, encryptedData
    this.updateStatus('正在读取登录信息...')
    // 获取code
    wxlogin().then(data => {
      code = data.code
      this.updateStatus('正在读取用户信息...')
      //获取用户信息
      return wxGetUserInfo()
    }).then(result => {
      let { iv, userInfo, encryptedData} = result
      // let userInfo = result.userInfo
      app.globalData.userInfo = userInfo
      this.setData({ userInfo, status:'正在登录...' })
      let url = app.globalData.url + '/c/v1/token'
      console.log(app)
      //获取token
      return login(url, code, iv, encryptedData)
    }).then(loginResult => {
        let { token, user } = loginResult.data.data
        app.globalData.user = user
        app.globalData.token = token
        this.setData({token, user})
        this.updateStatus('当前微信用户没有被邀请或绑定硬件设备，请在App中绑定用户后进行操作-0')
        //处理ticket
        this.tryTicket()
    }).catch(e => {
      console.log('错误信息： ', e)
      this.updateStatus('登录微信账号发生错误')
    })
  },

  tryTicket: function() {
    if (app.globalData.ticket) {
      //ticket存在
      this.getTicket().then(result => {
        console.log('检查ticket : ',result)
        let statusCode = result.statusCode
        let code = result.data.code
        let data = result.data.data
        if (statusCode !== 200) {
          // 错误处理
          if (statusCode == 400) this.setData({ 'status': '邀请码无效' })
          else if (code == 60001) this.updateStatus('当前微信用户已注册') // 用户已在ticket所在设备注册过
          else if (code == 60202) this.updateStatus('邀请码已过期')
          else if (code == 60204) this.updateStatus('您已申请过加入设备，无需重复提交')
          else this.updateStatus(getErrorMessage(code))
          this.navToHome()
          
        } else {
          // 状态码正确 判断是否能fill
          this.setData({
            creatorInfo: result.data.data.creatorInfo,
            station: result.data.data.station
          })
          if (data == null) {
            //ticket已使用
            this.updateStatus('邀请已完成')
            this.navToHome()
          } else if (data.user && data.user.type == 'pending') {
            // 已有ticket被填写
            this.updateStatus('您已申请加入 ' + this.data.station.name + '\n 请等待确认')
            this.data.pulling = true
            this.pulling() 
          } else if (data.user && data.user.type == 'rejected' && data.user.ticketId == app.globalData.ticket) {
            // 当前ticket 已被拒绝
            this.updateStatus('你已被拒绝')
            this.navToHome()
          }else {
            // ticket 未被使用
            this.setData({ status: '邀请你加入' + this.data.station.name + '.', state: 'wait' })
          }
        }
      }).catch(e => {
        //接口调用失败
        console.log(e)
        this.updateStatus('数据请求错误')
      })
      
    }else {
      this.updateStatus('当前微信用户没有被邀请, 即将跳转...')
      //todo login
      this.navToHome()
    }
  },

  //填ticket
  submitTicket() {
    let url = app.globalData.url + '/c/v1/tickets/' + app.globalData.ticket + '/invite'
    fillTicket(url, this.data.token).then(data => {
      console.log(data)
      if (data.statusCode == 403) {
        this.setData({ status: getErrorMessage(data.data.code), state: ''})
      }else {
        this.setData({ status: '您已申请加入 ' + this.data.station.name + '\n 请等待主人确认', state: '' })
        this.data.pulling = true
        this.pulling()
      }
    }).catch(e => {
      console.log(e)
    })
  },
  //轮询ticket
  pulling() {
    if (!this.data.pulling) return
    this.data.pulling = false
    this.getTicket().then(ticketResult => {
      if (ticketResult.statusCode == 403 && ticketResult.data.code == 60001) {
        this.updateStatus('你已被添加进设备')
        return this.navToHome()
      }
      console.log(ticketResult)
      this.checketPullResult(ticketResult.data.data.user)
      setTimeout(this.pulling, 5000)
    }).catch(e => {
      console.log(e)
      this.data.pulling = true
      this.pulling()
    })
  },

  // 查询ticket
  getTicket() {
    let url = app.globalData.url + '/c/v1/tickets/' + app.globalData.ticket
    return checkTicket(url, this.data.token)
  },

  //处理轮询结果
  checketPullResult(ticketResult) {
    if (ticketResult.type == 'resolved') {
      this.updateStatus('你已被添加进设备')
    } else if (ticketResult.type == 'rejected') {
      this.updateStatus('你已被拒绝')
    } else if (ticketResult.type == 'pending') {
      //nothing
      this.data.pulling = true
    }
  },

  // 页面跳转
  navToHome: function() {
    setTimeout(() => {
      wx.redirectTo({
        url: '../home/home',
      })
    }, 1500)
  }
})