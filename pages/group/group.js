var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    group: {},
    commits: [],
    tweets: [],
    boxs: [],
    inputValue: '',
    inputBoxName: '',
    currentUserID: '123',
    toView: '',
    scrollTool: true,
    settingPin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let group = app.globalData.currentGroup
    if (!group) wx.navigateBack({})
    this.setData({ group, boxs: [] })
    console.log(this.data.group)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({ title: this.data.group.name })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
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

  init() {
    let group = app.globalData.currentGroup
    let boxUUID = group.uuid
    let apiUrl = '/boxes/' + boxUUID + '/tweets'
    util.stationJson(apiUrl, 'GET', { metadata: true }).then(tweets => {
      console.log(tweets)
      tweets.forEach(item => {
        if (item.list.length == 0) item.cType == 'text'
        else if (item.list.every(listItem => !!listItem.metadata)) item.cType = 'photo'
        else item.cType = 'file'
        // date
        item.ctime = (new Date(item.ctime)).toLocaleString()
        // total size 
        item.totalSize = 0
        if (item.tweeter) {
          let tweeter = group.users.find(user => user.id === item.tweeter.id)
          if (tweeter && tweeter.avatarUrl) item.tweeter.avatarUrl = tweeter.avatarUrl
          if (tweeter && tweeter.nickName) item.tweeter.nickName = tweeter.nickName
          else item.tweeter.nickName = '未知'
        }else {
          item.tweeter = {}
          item.tweeter.nickName = '未知'
        }
        item.list.forEach(file => {
          item.totalSize += (typeof file.size === 'number' && !isNaN(file.size)) ? file.size : 0
          if (item.ctype !== 'photo') return
          //get image from finished queue 
          if (false) {
            //todo
          } else {

          }
        })
        item.totalSize = util.formatSize(item.totalSize)
      })
      console.log(tweets)
      this.setData({ tweets })
    }).catch(e => {
      console.log(e)
    })

  },


  //交互-----------------------------------------------------

  // 切换pin列表
  toggleHeader: function () {
    this.setData({ scrollTool: !this.data.scrollTool })
  },

  // 滚动隐藏pin列表
  scroll: function (e) {
    if (!this.scrollTop) return this.scrollTop = e.detail.scrollTop
    if (e.detail.scrollTop - this.scrollTop > 60) {
      if (this.data.scrollTool) this.setData({ scrollTool: false })
    }
    this.scrollTop = e.detail.scrollTop
  },

  // 打开新建置顶
  openSettingPin: function () {
    this.setData({ settingPin: true })
  },

  // 关闭新建置顶
  touchDialog: function (e) {
    if (e.target.id == 'create-pin-container' && e.currentTarget.id == 'create-pin-container')
      this.setData({ settingPin: false })
  },

  // commit内容输入
  input: function (e) {
    this.setData({ inputValue: e.detail.value })
  },

  // Box名称输入
  inputBoxName: function (e) {
    let inputBoxName = e.detail.value
    this.setData({ inputBoxName })
  },

  // 打开相册
  openCamera: function () {
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res, tempFiles) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        app.globalData.tempFilePaths = tempFilePaths
        wx.navigateTo({ url: '../commit/commit' })
      }
    })
  },

  // 查看照片
  previewImage: function (e) {
    let dataset = e.currentTarget.dataset
    let url = dataset.url
    let id = dataset.id
    let commit = this.data.commits.find(item => item.objectId === id)
    let urls = commit.content
    wx.previewImage({
      urls: urls,
      current: url
    })
  },

  // 跳转至盒子
  openBox: function (e) {
    let boxid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../box/box?id=' + boxid,
    })
  },

  // 跳转至单次用户提交
  openCommit: function (e) {
    wx.navigateTo({
      url: '../commitList/commitList?id=' + e.currentTarget.dataset.id,
    })
  },

  // 跳转至群设置
  navToSetting: function (e) {
    wx.navigateTo({ url: '../groupSetting/groupSetting?id=' + this.data.group.id, })
  },

  //Api------------------------------------------------------

  // 提交文字
  commitText: function () {
    let Group = Bmob.Object.extend('Group')
    let group = new Group()
    group.id = app.globalData.currentGroup.objectId
    let Commit = Bmob.Object.extend("Commit")
    let commit = new Commit()
    commit.set('user', user)
    commit.set('parent', group)
    commit.set('description', this.data.inputValue)
    commit.set('type', 'text')
    this.setData({ inputValue: '' })
    commit.save({
      success: result => {
        console.log(result)

        this.getCommits()
      }
    })
  },

  // 开始录音
  startRecord(e) {
    wx.startRecord({
      success: function (res) {
        wx.showNavigationBarLoading()
        wx.showLoading({
          title: '上传中',
        })
        let tempFilePath = [res.tempFilePath]
        let file = new Bmob.File('record.silk', tempFilePath)
        file.save().then(function (res) {
          console.log(res)
          let url = res.url()
          let Group = Bmob.Object.extend('Group')
          let group = new Group()
          group.id = app.globalData.currentGroup.id
          let Commit = Bmob.Object.extend("Commit")
          let commit = new Commit()
          commit.set('user', user)
          commit.set('parent', group)
          commit.set('content', [url])
          commit.set('type', 'record')
          commit.save({
            success: () => {
              wx.hideNavigationBarLoading()
              wx.hideLoading()
              wx.showToast({
                title: '提交成功',
              })
            }
          })
        }, function () {
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          wx.showToast({
            title: '提交失败',
          })
        })
      },
      fail: function (res) {
        console.log('fail', res)
      },
      complete: function (res) {
        console.log('complete')
      }
    })
  },

  // 停止录音
  stopRecord(e) {
    console.log('stro', e)
    wx.stopRecord()
  },

  // 播放/暂停 音频
  controlVoice: function (e) {
    let dataset = e.currentTarget.dataset
    let url = dataset.url
    let id = dataset.id
    let commit = this.data.commits.find(item => item.id === id)
    if (commit.attributes.play) {
      // stop
      wx.stopVoice()
      commit.attributes.play = false
      this.setData({ commits: this.data.commits })
    } else {
      //play

      //download vioce before play...


      wx.playVoice({
        filePath: url,
        complete: () => {
          console.log('complete')
          commit = this.data.commits.find(item => item.id === id)
          commit.attributes.play = false
          this.setData({ commits: this.data.commits })
        },
        success: () => {
          console.log('success')
        },
        fail: (e) => {
          console.log('fail', e)
        }
      })
      commit.attributes.play = true
      this.setData({ commits: this.data.commits })
    }

  },

  // 创建Box
  createBox: function () {
    let groupid = this.data.group.objectId
    let name = this.data.inputBoxName
    Bmob.Cloud.run('createBox', { groupid, name }, {
      success: result => {
        console.log(result)
        Bmob.Cloud.run('getBoxsWithId', { groupid }, {
          success: result => {
            console.log(result)
            let boxs = JSON.parse(result)
            this.setData({ inputBoxName: '', settingPin: false, boxs })
          },
          error: function (err) {
            console.log('error', err)
          }
        })
      },
      error: function (err) {
        console.log('error', err)
      }
    })
  },

  // 获取群commit列表
  getCommits: function () {
    let today = new Date()
    let month = (today.getMonth() + 1).toString()
    let day = (today.getDate()).toString()
    if (month.length == 1) month = '0' + month
    if (day.length == 1) day = '0' + day
    let todayString = today.getFullYear() + '-' + month + '-' + day

    let userid = user.id
    let groupid = app.globalData.currentGroup.objectId
    Bmob.Cloud.run('getCommit', { userid, groupid }, {
      success: result => {
        try {
          let commits = JSON.parse(result)
          commits.forEach(item => {
            if (item.type == 'record') item.play = false
            let arr = item.updatedAt.split(' ')
            let index = item.updatedAt.indexOf(todayString)
            if (index == -1) item.updateTime = arr[0]
            else item.updateTime = arr[1]
          })
          console.log('commit列表为：', commits)
          this.setData({ commits: commits })
          if (!commits.length) return
          let lastID = commits[commits.length - 1].objectId
          this.setData({ toView: lastID })
        } catch (e) {
          wx.showModal({
            title: '获取数据错误',
            content: '请重试',
            confirmText: '重试',
            success: () => {
              this.getCommits()
            }
          })
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }
})