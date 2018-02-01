// home.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createGroup: false,
    groupName: '',
    groupList: []
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({ title: '私有群' })
  },

  // 初始化 获取群列表
  init: function () {
    wx.showLoading()
    util.getGroupList().then(data => {
      wx.hideLoading()
      
      this.setData({ groupList: data })
    }).catch(e => {
      wx.hideLoading()
      wx.showModal({
        title: '获取服务器数据错误',
        content: '请重试',
        confirmText: '重试',
        success: () => { this.init() }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.init()
  },

  //打开创建群对话窗
  openCreateGroup: function () {
    this.setData({
      createGroup: true
    })
  },

  //关闭创建群对话
  touchDialog: function (e) {
    if (e.target.id == 'frame' && e.currentTarget.id == 'frame') {
      this.setData({
        createGroup: false,
        groupName: ''
      })
    }
  },

  //输入群名称
  inputGroupName: function (e) {
    this.setData({ groupName: e.detail.value })
  },

  //创建群
  createGroup: function () {
    let name = this.data.groupName
    let Group = Bmob.Object.extend("Group")
    let myGroup = new Group()
    myGroup.set('name', name)
    myGroup.set('user', user)
    myGroup.set('privileged', user.id)
    myGroup.set('member', [user.id])
    myGroup.set('content', [])
    myGroup.set('pin', [])
    myGroup.save(null, {
      success: result => {
        console.log(result)
        this.setData({
          createGroup: false,
          groupName: ''
        })
        this.init()
      },
      error: (result, error) => console.log('创建群失败', result, error)
    })
  },

  //进入群
  openGroup: function (e) {
    let index = e.currentTarget.dataset.group
    let group = this.data.groupList[index]
    app.globalData.currentGroup = group
    wx.navigateTo({ url: '../group/group' })
  }
})

