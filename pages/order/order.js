// pages/order/order.js
import {
    getCode,
    postCode,
    orderLi,
    PayParams
} from '../../models/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: null, //激活码
        codeLi: [], //订单状态
    },

    //   输入激活码
    setCode(e) {
        this.setData({
            code: e.detail.value
        })
    },

    //   激活码兑换
    onGetCode() {
        console.log(111, this.data.code);
        let code = this.data.code
        let _this = this
        if (code.length == 11) {
            getCode(this.data.code).then(res => {
                console.log(res);
                if (res) {
                    wx.showModal({
                        title: '激活提示',
                        content: `${res.msg},时效${res.time} 天`,
                        confirmText: '激活',
                        success(res) {
                            if (res.confirm) {
                                postCode(code).then(async res => {
                                    wx.showToast({
                                        title: '激活成功',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                    _this.getOrders()
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: '激活码已使用',
                        icon: 'error',
                        duration: 2000
                    })

                }
            })
        }

    },

    //购买
    async onPay(){
        let Params= await PayParams()
        console.log(111,Params);
    },
    //查询订单
    async getOrders() {
        let li = await orderLi()
        console.log(li);
        this.setData({
            codeLi: li
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '会员中心'
        })
        this.getOrders()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})