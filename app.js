//app.js
// var { Client, Message } = require('./utils/paho-mqtt.js')
var DownloadTask = require('./utils/downloadTask.js')
var mqtt = require('./utils/my_mqtt.js')
// var client = mqtt.connect('wss://workyun.com/mqtt')


App({
  onLaunch: function(options) {
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
    // url: 'http://test.siyouqun.com',
    // url: 'http://10.10.9.87:4000',
    url: 'https://www.siyouqun.com',
    user: null,
    userInfo: null,
    ticket:'',
    currentGroup: null,
    tempFilePaths: [],
    client: null,
    readyQueue: [],
    downloading: [],
    downloaded: new Map(),
    maxTask: 2
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
    // console.log(this.globalData.user)
    let clientId = 'client_mini_' + this.globalData.user.id
    // let client = this.globalData.client = new Client('mqtt://test.siyouqun.com', 1883, '', clientId)
    // client.connect({
    //   onSuccess: () => {
    //     console.log('connect success', this)
    //     this.subscribe('wisnuc')
    //   }
    // })

    // client.onMessageArrived = msg => {
      // console.log('message arrive', msg)
    // }
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

  // add image download task
  addDownloadTask: function (boxUUID, tweetIndex, listIndex, sha256, metadata, callback) {
    let task = new DownloadTask(boxUUID, tweetIndex, listIndex, sha256, metadata, callback)
    this.globalData.readyQueue.unshift(task)
    this.schedule()
  },

  // schedule download readyQueue
  schedule: function() {
    let { downloading, readyQueue, downloaded } = this.globalData
    while (downloading.length < this.globalData.maxTask && readyQueue.length) {
      // push task into runningQueue
      let task = readyQueue.splice(0, 1)[0]
      let checkFinishQueue = downloaded.get(task.sha256)
      // trigger task into finish when the same image has been download
      if (checkFinishQueue) task.finish(checkFinishQueue.url)
      else {
        // begin download
        downloading.push(task)
        task.work()
      }
    }
  }
})
