// pages/me/me.js
import {userMsg,upUserMsg} from '../../models/index'
import {uploadCOS}  from '../../models/cos'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickenme:false,
    user:{}
  },

    //   修改昵称
    onNikenme: function(){
        this.setData({
            nickenme:true
        })
    },
    // 取消修改昵称
    onNikenmeBlur:function(e){
        let val = e.detail.value
        if(val){
            upUserMsg({nickname:val}).then(async res=>{
                this.setData({
                    user: await userMsg()
                })
            })
        }
    },

    //修改头像
    bindGetUserInfo (e) {
        let newAvatarUrl = e.detail.avatarUrl
        console.log(newAvatarUrl);
        uploadCOS(newAvatarUrl,'im/user',cb=>{
            if(cb){
                console.log('修改头像',cb);
                upUserMsg({avatarUrl:cb}).then(async res=>{
                    let user = await userMsg()
                    console.log(user);
                    this.setData({
                        user: user
                    })
                })      
            }
        })
    },

    navPage:function(e){
        let page = e.currentTarget.dataset.page
        console.log(page);
        wx.navigateTo({
        url: `/pages/${page}/${page}`,
        })
    },

 
  /**
   * 生命周期函数--监听页面加载
   */
    async onLoad(options) {
        let user = await userMsg()
        console.log(user);
        wx.setNavigationBarTitle({
            title: '我的'
        })
        this.setData({
            user: user
        })
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