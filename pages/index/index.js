import {
    userMsg,
    Ims,
    upUserMsg
} from '../../models/index'
import io from '../../utils/weapp.socket.io'
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        modelA: false,
        ims: [], //信道
        _ims: [], //信道下标
        user: null //用户信息
    },

    onMode: function (e) {
        this.setData({
            modelA: !this.data.modelA
        })
    },

    navPage: function (e) {
        let page = e.currentTarget.dataset.page
        console.log(page);
        wx.navigateTo({
            url: `/pages/${page}/${page}`,
        })
    },

    //   进入信道
    navIms: function (e) {
        let {ims,title } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/im/im?im=${ims}&title=${title}`,
        })
    },

    //   加载数据
    loadData: async function () {
        let ims = await Ims()
        let _ims = [] //信道下标
        ims.map(item => {
            _ims.push(item._id)
        })
        console.log('信道列表', ims);
        let user = await userMsg()
        this.setData({
            ims: ims,
            _ims: _ims,
            user: user,
        })
    },

    //加载信道
    loadSocket (id){
        const socket = io('http://192.168.1.6:3000');
        socket.on(id, (data) => {
            let imsArr = this.data.ims
            let _imsArr = this.data._ims
            const index = _imsArr.findIndex(element => element === data._id);
            imsArr.splice(index, 1, data)
            console.log('im推送', data);
            this.setData({
                ims: imsArr
            })
        });
        this.socket = socket
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('处理链接参数');
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        app.globalData.codeLoad.then(async res=>{
            let user = await userMsg()
            console.log(222,user);
            this.setData({
                user: user
            })
            await upUserMsg({online: true}) //跟新为在线
            this.loadData() //加载信道数据页面
            this.loadSocket(user.id)    //链接信道
            
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: async function () {
        await upUserMsg({online: false})
        this.socket.disconnect(); // 断开连接
        console.log('ims 断开连接');
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.socket.disconnect(); // 断开连接
        console.log('ims 断开连接');
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

    }
})