var { stationDownload } = require('./util')

class DownloadTask {
  constructor(boxUUID, tweetIndex, listIndex, sha256, metadata, callback) {
    this.boxUUID = boxUUID
    this.tweetIndex = tweetIndex
    this.listIndex = listIndex
    this.sha256 = sha256
    this.metadata = metadata
    this.url = ''
    this.callback = callback
    this.state = 'ready'
  }

  work() {
    this.state = 'downloading'
    let api = '/media' + this.sha256
    let params = {
      alt: 'thumbnail',
      width: 200,
      height: 200,
      autoOrient: true,
      boxUUID: this.boxUUID
    }
    stationDownload('/media/' + this.sha256, params).then(url => {
      this.finish(url)
    }).catch(e => {
      console.log(e)
      this.finish(null, e)
    })
  }

  finish(url, err) {
    let app = getApp()
    let index = app.globalData.downloading.indexOf(this)
    app.globalData.downloading.splice(index, 1)
    if (err) {
      // todo

    }else {
      this.state = 'finish'
      this.url = url
      
      
      if (index !== -1) {
        app.globalData.downloaded.set(this.sha256, this)
      }
      app.schedule()
      this.callback(this)
    }
  }


}

module.exports = DownloadTask