//app.js
App({
  onLaunch: function(options) {
    
  },

  onShow: function (options) {
    console.log(options)
    if (options.query.ticket) {
      this.globalData.ticket = options.query.ticket
    }
  },

  globalData: {
    // url: 'http://10.10.9.87:4000',
    url: 'http://test.siyouqun.com',
    userInfo: null,
    ticket:'',
    currentGroup: null,
    tempFilePaths: []
  }
})
