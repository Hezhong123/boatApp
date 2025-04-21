// pages/im/im.js
import io from '../../utils/weapp.socket.io'
import {chooseMessageFile} from '../../models/image'  //图片
import {startAidoe , stopAidoe,backgroundAudio} from '../../models/recorderManager' //录音
import {imMsg,userMsg,imsUnread,ImsId,msgTime} from '../../models/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        into: '', //滚动矛点
        aideo:false, //录制语音 
        aideTime: 0, //语音时长
        aideoId:null ,//播放声音id
        container: false, //设置按钮
        user: {}, //用户悉尼下
        im: '', //信道
        msg: '', //输入内容
        msgli: [], //对话内容
        userImg: 'https://boattext-1251490080.cos.ap-guangzhou.myqcloud.com/im/user/0.png'
    },

    //设置对话框
    onSetqun: function () {
        this.setData({
            container: !this.data.container
        })
    },

    //发送消息
    imSend: function(text,type){
        this.socket.emit('sendMessage', {
            "text": text,
            "type": type,
            "room": this.data.im._id,
            "id": this.data.user.id
        })
    },

    //监听输入内容
    onMsgChange: function (e) {
        console.log('输入',e.detail.value);
        this.setData({
            msg:e.detail.value
        })       
    },
 
    //播放声音
    onAideo(e){
        let {url,id} = e.currentTarget.dataset
        // console.log(url,id);
        this.setData({
            aideoId:id
        })
        backgroundAudio(url,cb=>{
            this.setData({
                aideoId:null
            })
        })
        
    },

    //   发送文本消息
    onMsgSend(e){
        this.imSend(this.data.msg, 1)
    },
    
    // 选择图片并且发送
    onChooseMessage(){
        chooseMessageFile(url=>{
            console.log('发送图片',url);
            this.imSend(url, 2)
        })
    },
    
    //录制声音,
    startAideo(){
        startAidoe(cb=>{
            this.setData({
                aideo:true
            })
        })
    },
    //送手发送语音
    stopAideo(){
        stopAidoe(cb=>{
            if(cb){
                console.log('推送声音消息',cb);
                this.imSend(cb,3)
            }else{
                this.setData({
                    aideo:false
                }) 
            }
            
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let {
            im,
            title
        } = options
        console.log('信道信息',im, title);
        let msgli = await imMsg(im)
        let imData = await ImsId(im)
        console.log('信道Id',imData,im,msgli);
        this.setData({
            msgli: msgli,
            im: imData,
            into: this.intoFun('im'),
            user: await userMsg()
        })
        wx.setNavigationBarTitle({
            title: title
        })
        const socket = io('http://192.168.1.6:3000');
        socket.on('connection', msg => {
            console.log('socketIm', msg)
            //加入房间
            socket.emit('joinRoom', {
                room: im
            })
        })
        socket.on('newMessage', (data) => {
            let msgliArr = this.data.msgli
            msgliArr.push(data)
            console.log(data, msgliArr);
            this.setData({
                msg: '',
                into: this.intoFun('im'),
                msgli: msgliArr
            })
        });
        this.socket = socket
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
    async onUnload() {
        if (this.socket) {
            this.socket.disconnect(); // 断开连接
            console.log('socketIm 断开连接');
        }
        //跟新未读红点及时间
        await imsUnread(this.data.im._id)
        console.log('退出信道', this.data.im);
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
    },

    // 滚动秒点随机数
    intoFun: function (e) {
        return e + Math.floor(Math.random() * 100 + 1)
    },
})