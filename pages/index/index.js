
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelA:false,
    userImg:'https://img.freepik.com/free-photo/asian-man-wearing-glasses-portrait-smiling-face-close-up_53876-139746.jpg'
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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