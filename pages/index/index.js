import {userMsg,Ims} from '../../models/index'
import io from '../../utils/weapp.socket.io'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelA:false,
    ims:[], //信道
    _ims:[], //信道下标
    user:{
        avatarUrl:''
    }
  },

  childCatchTap:function(e){
    console.log(1111);
  },

  onMode:function(e){
    this.setData({
        modelA: !this.data.modelA
    })
  },

  navPage:function(e){
    let page = e.currentTarget.dataset.page
    console.log(page);
    wx.navigateTo({
      url: `/pages/${page}/${page}`,
    })
  },

//   进入信道
  navIms: function(e){
      console.log(e);
    let ims = e.currentTarget.dataset.ims
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
        url: `/pages/im/im?im=${ims}&title=${title}`,
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: async function (options) {
       let ims = await Ims()
       let _ims = []  //信道下标
       ims.map(item=>{
        _ims.push(item._id)
       })
       let user = await userMsg()
       console.log('信道列表',ims);
       const socket = io('http://192.168.1.6:3000');
        socket.on(user.id, (data) => {
            const index = _ims.findIndex(element => element === data._id);
            ims.splice(index,1,data)
            this.setData({
                ims:ims
            })
            console.log(index,_ims,data._id);
        });
        this.socket = socket
        this.setData({
            user: user,
            ims: ims,
            _ims:_ims
        })
  },

 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.socket.disconnect(); // 断开连接
    console.log('ims 断开连接');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
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