// app.js
import {request} from './models/request'

App({
   onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //token 判断登陆
    if(!wx.getStorageSync('token') || Date.now() >wx.getStorageSync('token_in') ){
        login()
    }
  },
  globalData: {
    userInfo: null
  }
})


 // 登录 
 function login(){
    wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
              console.log(res.code)
              request({
                  url: `/user/weCat/?code=${res.code}`, 
                  method: 'GET',
              }).then(res=>{
                wx.setStorageSync('token',res.token)
                wx.setStorageSync('token_in',res.token_in)
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
        }
      })
}
