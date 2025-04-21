// app.js
import {
    request
} from './models/request'

App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


    },
    globalData: {
        userInfo: null,
        codeLoad: new Promise((r, e) => {
            //token 判断登陆
            if (!wx.getStorageSync('token') || Date.now() > wx.getStorageSync('token_in')) {
                wx.login({
                    success: res => {
                        // 发送 res.code 到后台换取 openId, sessionKey, unionId
                        if (res.code) {
                            console.log('用户Token', res.code)
                            request({
                                url: `/user/weCat/?code=${res.code}`,
                                method: 'GET',
                            }).then(data => {
                                console.log('写入token');
                                wx.setStorageSync('token', data.token)
                                wx.setStorageSync('token_in', data.token_in)
                                r(true)
                            })
                        } else {
                            e('没有获得code')
                            console.log('没有获得code' + res.errMsg)
                        }
                    }
                })
            }else{
                r(true)
            }
        })
    }
})