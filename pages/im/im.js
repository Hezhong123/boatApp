// pages/im/im.js
import io from '../../utils/weapp.socket.io'
import {imMsg,userMsg} from '../../models/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    into:'', //滚动矛点
    container:false, //设置按钮
    user:{}, //用户悉尼下
    im:'',  //信道
    msg:'', //输入内容
    msgli:[], //对话内容
    userImg:'https://boattext-1251490080.cos.ap-guangzhou.myqcloud.com/im/user/0.png'
  },

  onSetqun:function(){
      this.setData({
          container: !this.data.container
      })
  },

//   发送文本消息
  onMsgChange:function(e){
    let val = e.detail.value
    this.socket.emit('sendMessage',{
        "text":val,
        "type":2,
        "room":this.data.im,
        "id":100000
    })
  },

  // 滚动秒点随机数
  intoFun: function (e) {
    return e + Math.floor(Math.random() * 100 + 1)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let {im,title} = options
    let msg = await imMsg(im)
    console.log('信道Id',im,title,msg);
    this.setData({
        msgli:msg,
        im:im,
        into:this.intoFun(),
        user:await userMsg()
    })
    wx.setNavigationBarTitle({
        title: title
    })
    const socket = io('http://192.168.1.6:3000');
    socket.on('connection',msg=>{
        console.log('socketIm',msg)
        //加入房间
        socket.emit('joinRoom', {
            room:im
        })
    })
    socket.on('newMessage', (data) => {
        let msgliArr = this.data.msgli
        msgliArr.push(data)
        console.log(data,msgliArr);
        this.setData({
            msg:'',
            into:this.intoFun('im'),
            msgli:msgliArr
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
  onUnload() {
    if (this.socket) {
        this.socket.disconnect(); // 断开连接
        console.log('socketIm 断开连接');
    }
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