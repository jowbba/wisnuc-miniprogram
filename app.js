//app.js
App({
  onLaunch: function(options) {
    console.log(options)
    if (options.query.ticket) {
      this.globalData.ticket = options.query.ticket
    }
  },

  globalData: {
    userInfo: null,
    ticket:'',
  }
})
