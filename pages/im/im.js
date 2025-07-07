// pages/im/im.js
import io from '../../utils/weapp.socket.io'
import {
    chooseMessageFile
} from '../../models/image' //图片
import {
    startAidoe,
    stopAidoe,
    backgroundAudio
} from '../../models/recorderManager' //录音
import {imMsg,userMsg,imsUnread,ImsId,upUserMsg,msgWord,msgTts,socketUrl,postCollect,delMsg} from '../../models/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        Loading:false,   //加载
        into: '', //滚动矛点
        rmMsg: null, //删除元素
        aideo: false, //录制语音 
        aideTime: 0, //语音时长
        aideoId: null, //播放声音id
        container: false, //设置按钮
        user: {}, //用户信息
        im: '', //信道
        length:null, //群长度 
        msg: '', //输入内容
        word: [], //词列
        msgli: [], //对话内容
    },

    //删除撤回操作
    actMsg(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            rmMsg:index
        })
    },

    // 收藏
    onMsgPut(e){
        let id = e.currentTarget.dataset.id
        postCollect(id).then(res=>{
            console.log(res);
        })
        this.upData()
        console.log(111,id);
    },

    //删除
    onMsgDel(e){
        let id = e.currentTarget.dataset.id
        delMsg(id).then(res=>{
            console.log(111,res);
        })
        this.upData()
        console.log(111,id);
    },

    //开通关闭 词列/ 跟读
    async onChoose(e) {
        let act = e.currentTarget.dataset.act
        this.vipChoose(act)
    },

    //设置对话框
    onSetqun: function () {
        this.setData({
            container: !this.data.container
        })
    },

    //发送消息
    imSend: function (text, type) {
        this.socket.emit('sendMessage', {
            "text": text,
            "type": type,
            "room": this.data.im._id,
            "id": this.data.user.id
        })
    },

    //清空此列
    rmWord() {
        if (!this.data.msg) {
            this.setData({
                word: []
            })
        }
    },

    //监听输入内容
    onMsgChange: function (e) {
        let input = e.detail.value
        if (!this.data.user.word) {
            this.setData({
                msg: input
            })
            return
        }
        console.log('输入', input, input.length);
        if (input.length == 0) {
            this.setData({
                word: []
            })
        }
        let wordArr = this.data.word
        const regex = /^[\p{P}]$/u; //字符串正则
        const regex1 = /[a-zA-Z]/ //英文正则
        if (this.data.msg.length == 0 || input.length > this.data.msg.length) {
            let srt = this.getNewText(this.data.msg, input)
            // console.log('比对', srt);
            if (regex.test(srt)) { //过滤符号
                wordArr.push(srt)
                this.setData({
                    msg: this.data.msg + srt,
                    word: wordArr
                })
            } else if (regex1.test(srt)) { //过滤英文
                wordArr.push(srt)
                this.setData({
                    msg: this.data.msg + srt,
                    word: wordArr
                })
            } else {
                const regex2 = /^\s*$/;
                if (!regex2.test(srt)) {
                    msgWord(srt).then(res => {
                        wordArr.push(res.enQ)
                        this.setData({
                            msg: this.data.msg + srt,
                            word: wordArr
                        })
                    })
                }
            }
        } else {
            this.setData({
                msg: input
            })
        }
    },

    //播放声音
    onAideo(e) {
        let {url,id,type,enq} = e.currentTarget.dataset
        // console.log('声音播放', e.currentTarget.dataset);
        if (type == 3) {
            this.setData({
                aideoId:id
            })
            backgroundAudio(url, cb => {
                this.setData({
                    aideoId: null,
                })
            })
        }
        if(type == 1 && this.data.user.vip){
            if(url){
                this.setData({
                    aideoId: id
                })
                backgroundAudio(url, cb => {
                    this.setData({
                        aideoId: null,
                    })
                })
            }else{
                msgTts(id,enq).then(newUrl=>{
                    this.setData({
                        aideoId: id
                    })
                    backgroundAudio(newUrl, cb => {
                        this.setData({
                            aideoId: null,
                        })
                    })
                })
            }
            
        }else{
            this.showVip()
        }
    },

    //   发送文本消息
    onMsgSend(e) {
        this.imSend(this.data.msg, 1)
    },

    // 选择图片并且发送
    onChooseMessage() {
        chooseMessageFile(url => {
            console.log('发送图片', url);
            this.imSend(url, 2)
        })
    },

    //录制声音,
    startAideo() {
        startAidoe(cb => {
            this.setData({
                aideo: true
            })
        })
    },
    //送手发送语音
    stopAideo() {
        stopAidoe(cb => {
            if (cb) {
                console.log('推送声音消息', cb);
                this.imSend(cb, 3)
            } else {
                this.setData({
                    aideo: false
                })
            }

        })
    },
    async upData(){
        let im = this.data.im._id
        this.setData({
            msgli : await imMsg(im),
            imData : await ImsId(im),
            rmMsg:null
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
        console.log('信道信息', im, title);
        let msgli = await imMsg(im)
        let imData = await ImsId(im)
        let user = await userMsg()
        console.log('信道Id', user, imData, im, msgli);
        this.setData({
            Loading:false,
            msgli: msgli,
            im: imData,
            length:imData.userArr.length,
            into: this.intoFun('im'),
            user: user
        })
        wx.setNavigationBarTitle({
            title:imData.type==1?title:imData.imName
        })
        const socket = io(socketUrl);
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
            if(data.url){
                this.setData({
                    aideoId:data._id
                })
                backgroundAudio(data.url, cb => {
                    this.setData({
                        aideoId: null,
                    })
                })
            }
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
        if(this.data.im._id){
            await imsUnread(this.data.im._id)    
        }
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
    onShareAppMessage() {},

    // 滚动秒点随机数
    intoFun: function (e) {
        return e + Math.floor(Math.random() * 100 + 1)
    },

    //字符串对比G函数
    getNewText(oldStr, newStr) {
        if (oldStr === newStr) {
            return ""; // 如果两个字符串相同，返回空字符串
        }
        if (oldStr.length > newStr.length) {
            return "";
        }
        return newStr.substring(oldStr.length);
    },

    // 词列/ 跟读 开关
    async vipChoose(act) {
        if (this.data.user.vip >= 1) {
            let user = this.data.user
            if (act == 'word') {
                await upUserMsg({
                    'word': !user.word
                })
                user.word = !user.word
                this.setData({
                    user: user
                })
            }
            if (act == 'follow') {
                console.log(act, user.follow);
                await upUserMsg({
                    follow: !user.follow
                })
                user.follow = !user.follow
                this.setData({
                    user: user
                })
            }
        } else {
            this.showVip()
        }
    },

    showVip(){
        wx.showModal({
            title: 'vip过期提醒',
            content: '使用激活码或充值续费会员,继续使用词列,跟读功能',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                        url: '../../pages/order/order',
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
})
