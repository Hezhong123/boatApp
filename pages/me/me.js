// pages/me/me.js
import {userMsg,upUserMsg,getCollect,delCollect} from '../../models/index'
import {uploadCOS}  from '../../models/cos'
import { backgroundAudio } from '../../models/recorderManager' //录音
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[], //收藏消息
    aideoId:null,    //播放声音
    nickenme:false,
    loadig:true,    //用户加载
    loadigCollect:true, //收藏加载
    user:{}
  },

    //   修改昵称
    onNikenme: function(){
        let _this = this
        console.log(111,_this.data.user.nickname);
        wx.showModal({
            title: '修改昵称',
            placeholderText: _this.data.user.nickname,
            editable:true,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                upUserMsg({nickname:res.content}).then(async user=>{
                    _this.setData({
                        user: await userMsg()
                    })
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
       
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

    //删除收藏
    rmCollect(e){
        let {id} = e.currentTarget.dataset
        let _this = this
        wx.showModal({
            title:'警告⚠️',
            content:'删除这条收藏',
            success:(res)=>{
                delCollect(id).then(async r=>{
                    let collect = await getCollect()
                    _this.setData({collect:collect})
                })
            }
        })
        console.log(111, id);
    },
    // 播放声音
    onUrl(e){
        let {url,index} = e.currentTarget.dataset
        this.setData({
            aideoId:index
        })
        console.log(url);
        backgroundAudio(url, cb => {
            this.setData({
                aideoId: null,
            })
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
        let collect = await getCollect()
        let user = await userMsg()
        console.log(user,collect);
        wx.setNavigationBarTitle({
            title: '我的'
        })
        this.setData({
            user: user,
            loadig:false,   
            collect:collect, 
            loadigCollect:false,
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