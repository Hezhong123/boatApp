// pages/im/im.js
import io from '../../utils/weapp.socket.io'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    container:false,
    userImg:'https://img.freepik.com/free-photo/asian-man-wearing-glasses-portrait-smiling-face-close-up_53876-139746.jpg'
  },

  onSetqun:function(){
      this.setData({
          container: !this.data.container
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
        title: '对话内容'
      })
    const socket = io('http://192.168.1.6:3000');
    socket.on('connection',msg=>{
        console.log('socket',msg)
        //加入房间
        socket.emit('joinRoom', {
            room:'a123'
        })
    })
    socket.on('newMessage', (data) => {
        console.log(data);
    });
    socket.on('a1', (data) => {
        console.log(data);
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
        console.log('socket 断开连接');
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