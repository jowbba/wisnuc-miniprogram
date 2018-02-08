//app.js
var { Client, Message } = require('./utils/paho-mqtt.js')

App({
  onLaunch: function(options) {
    this.connect()
    setTimeout(() => {
      if (this.globalData.client) this.globalData.client.publish('wisnuc', 'hello world')
    }, 5000)
  },

  onShow: function (options) {
    console.log(options)
    if (options.query.ticket) {
      this.globalData.ticket = options.query.ticket
    }
  },

  globalData: {
    // url: 'http://10.10.9.87:4000',
    // url: 'http://test.siyouqun.com',
    url: 'http://10.10.9.87:4000',
    // url: 'http://www.siyouqun.org',
    userInfo: null,
    ticket:'',
    currentGroup: null,
    tempFilePaths: [],
    client: null,
    readyQueue: [],
    downloading: new Set(),
    downloaded: new Map()
  },

  randomString: function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },

  connect: function() {
    if (this.globalData.client && this.globalData.client.isConnected()) 
    return console.log('connect exist now')

    let client = this.globalData.client = new Client('wss://www.mengmeitong.com/mqtt', '100')
    client.connect({
      onSuccess: () => {
        // console.log('connect success', this)
        // this.subscribe('wisnuc')
      }
    })

    client.onMessageArrived = msg => {
      // console.log('message arrive', msg)
    }
  },

  subscribe: function(filter, subscribeOptions) {
    let client = this.globalData.client
    if (client && client.isConnected()) client.subscribe(filter, subscribeOptions)
    else console.log('subscribe failed')
  },

  publish: function (topic, payload, qos, retained) {
    let client = this.globalData.client
    if (client && client.isConnected()) {
      let message = new Message(payload)
      message.destinationName = topic
      message.qos = qos
      message.retained = retained
      client.send(message)
    }
  },

  addDownloadTask: function() {
    
  }
})
