var errCodeObj = {
  60001: '用户已存在',
  60200: '邀请码错误',
  60202: '邀请码已过期',
  60204: '您已申请过加入设备，无需重复提交'
}

function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  let d1 = [year, month, day].map(formatNumber).join('/')
  let d2 = [hour, minute, second].map(formatNumber).join(':')
  return d1 + ' ' + d2
  let today = new Date()
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatSize(size) {
  if (size < 1024) return size + 'B'
  else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB' 
  else if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + 'MB'
  else if (size < 1024 * 1024 * 1024 * 1024) return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
}

// 返回URL, TOKEN
function getReqParms() {
  let data = getApp().globalData
  return { token: data.token, url: data.url }
}

// 微信登录API
function wxlogin() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.login({
        success: res => resolve(res),
        fail: err => reject(err)
      })
    },500)
  })
}

// 微信获取用户信息API
function wxGetUserInfo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.getUserInfo({
        withCredentials: true,
        success: res => resolve(res),
        fail: err => reject(err)
      })
    },500)
  })
}

// 登录获取token
function login(url,code, iv, encryptedData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.request({
        url: url,
        data: { code, iv, encryptedData },
        method: 'POST',
        success: res => {
          console.log(res)
          if (res.statusCode !== 200) reject(res.data)
          else resolve(res)
        },
        fail: err => reject(err)
      })
    },500)
  })
}

// 查询ticket信息
function checkTicket(url,token) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: { Authorization: token },
      success: (result) => resolve(result),
      fail: err => reject(err)
    })
  })
}

// 填写ticket
function fillTicket(url, token) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      // data: { password: password },
      header: { Authorization: token },
      success: (result) => resolve(result),
      fail: err => reject(err)
    })
  })
}

// 判断错误类型
function getErrorMessage(errCode) {
  let message = errCodeObj[errCode]
  if (message) return message
  else return errCode + '： 未知错误'
}

// 获取群列表 （测试用）
function getGroupList() {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      // return reject('....')
      resolve([
        {
          "uuid": "126d9a28-0e7f-4573-b69b-80c032ed4b25",
          "name": "w",
          "owner": "b2524869-cc25-4c08-b480-a8ab8080c4b2",
          "users": [
            "b2524869-cc25-4c08-b480-a8ab8080c4b2"
          ],
          "ctime": 1516356443977,
          "mtime": 1516604715756
        },
        {
          "uuid": "f15b7003-b6c0-4243-95f5-062d7798c25e",
          "name": "test",
          "owner": "b2524869-cc25-4c08-b480-a8ab8080c4b2",
          "users": [
            "b2524869-cc25-4c08-b480-a8ab8080c4b2"
          ],
          "ctime": 1516354959168,
          "mtime": 1516355017981
        }
      ])
    }, 200)
  })
}

// 获取群列表
function getBox(id) {
  return new Promise((resolve, reject) => {
    let { url, token } = getReqParms()
    url += '/c/v1/boxes'
    if (id) url += '/' + id
    wx.request({
      url: url,
      header: { Authorization: token },
      success: res => {
        if (res.statusCode !== 200) reject(res.data)
        else resolve(res.data)
      },
      fail: res => {
        console.log(res)
        reject(res)
      } 
    })
  })
}

// 获取tweets （测试用）
function getTweetsWithId(boxId, start, end) {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      
      resolve( [
        {
          "comment": "不知疲倦的翻越， 每一座山丘",
          "ctime": 1516604715756,
          "index": 0,
          "list": [
            {
              "filename": "13610293657433.pdf",
              "sha256": "d8ad271fdfaa6d5bdb68dbba6fe2e279a1131b1f348cce470a9353d750d467b5",
              'size': 5000
            }
          ],
          "tweeter": {
            "id": "b2524869-cc25-4c08-b480-a8ab8080c4b2",
            "wx": [
              "oOMKGwuIQKjTktfqVmneEnt7sAVs"
            ],
            'avatarUrl': 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJBsJR1DhjgRZ5QoIBwqYttbz3do7IsDfs3yYbopeOUJkMvxN7Ch4SH22YM6gE4qavZJfJWSy5cpQ/0'
          },
          "type": "list",
          "uuid": "406271b3-91b8-49de-b0e5-e6348fe1c60f"
        },
        {
          "comment": "test",
          "ctime": 1516610871100,
          "index": 1,
          "list": [
            {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              'size': 5000,
            }
          ],
          "tweeter": {
            "id": "b2524869-cc25-4c08-b480-a8ab8080c4b2",
            "wx": [
              "oOMKGwuIQKjTktfqVmneEnt7sAVs"
            ],
            'avatarUrl': 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJBsJR1DhjgRZ5QoIBwqYttbz3do7IsDfs3yYbopeOUJkMvxN7Ch4SH22YM6gE4qavZJfJWSy5cpQ/0'
          },
          "type": "list",
          "uuid": "58576e59-5d59-44be-b4a8-ba051a2dfa1c"
        },
        {
          "comment": "test",
          "ctime": 1516610871100,
          "index": 1,
          "list": [
            {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              "url": 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517488512128&di=8bc211c779fd6f55ff58456713596c76&imgtype=0&src=http%3A%2F%2Fpic24.photophoto.cn%2F20120814%2F0005018348123206_b.jpg'
            },
            {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              "url": 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517487240436&di=313595920a6a667f4a3074a8557a6f2d&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F017274582000cea84a0e282b576a32.jpg'
            }, {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              "url": 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517488375167&di=dde7f4fbe11c3697ea32df93d6962c1e&imgtype=0&src=http%3A%2F%2Fimage.kejixun.com%2F2017%2F0515%2F20170515105913567.png'
            }, {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              "url": 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517488512128&di=8bc211c779fd6f55ff58456713596c76&imgtype=0&src=http%3A%2F%2Fpic24.photophoto.cn%2F20120814%2F0005018348123206_b.jpg'
            }, {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              "url": 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517488512128&di=8bc211c779fd6f55ff58456713596c76&imgtype=0&src=http%3A%2F%2Fpic24.photophoto.cn%2F20120814%2F0005018348123206_b.jpg'
            }, {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              "url": 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517488512128&di=8bc211c779fd6f55ff58456713596c76&imgtype=0&src=http%3A%2F%2Fpic24.photophoto.cn%2F20120814%2F0005018348123206_b.jpg'
            }, {
              "filename": "mmexport1514966938967.jpg",
              "sha256": "a50551a49b88e6582ad6235f85b2aeebedab8f070eb534b45ff63310489be4cb",
              "metadata": {
                "m": "JPEG",
                "w": 1000,
                "h": 682,
                "size": 314914
              },
              "url": 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517488512128&di=8bc211c779fd6f55ff58456713596c76&imgtype=0&src=http%3A%2F%2Fpic24.photophoto.cn%2F20120814%2F0005018348123206_b.jpg'
            }
          ],
          "tweeter": {
            "id": "123",
            "wx": [
              "oOMKGwuIQKjTktfqVmneEnt7sAVs"
            ],
            'avatarUrl': 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJBsJR1DhjgRZ5QoIBwqYttbz3do7IsDfs3yYbopeOUJkMvxN7Ch4SH22YM6gE4qavZJfJWSy5cpQ/0'
          },
          "type": "list",
          "uuid": "58576e59-5d59-44be-b4a8-ba051a2dfa1c"
        }
      ])
    }, 200)
  })
}

// 获取tweets
function getTweets() {
  return new Promise((resolve, reject) => {
    let { url, token } = getReqParms()
    wx.request({
      url: url + '/c/v1/tweets',
      success: res => {
        if (res.statusCode !== 200) reject(res.data)
        else resolve(res.data)
      },
      fail: res => {
        console.log(res)
        reject(res)
      } 
    })
  })
}

module.exports = {
  formatTime,
  formatSize,
  wxlogin,
  wxGetUserInfo,
  login,
  checkTicket,
  fillTicket,
  getErrorMessage,
  getGroupList,
  getBox,
  getTweetsWithId,
  getTweets
}
