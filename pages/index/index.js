import {
    userMsg,
    Ims,
    upUserMsg,
    socketUrl,
    postIm,
    rmIm
} from '../../models/index'
import io from '../../utils/weapp.socket.io'
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadin: true,
        modelA: false,
        ims: [], //信道
        _ims: [], //信道下标
        user: null, //用户信息
        imtype:1, //对话类型 1对话 2群聊
        startX: 0,
        moveX: 0,
        threshold: 40, // 滑动多少距离显示删除按钮
        currentIndex: -1 // 当前滑动的列表项索引

    },

    // 滑动触控
    touchStart: function (e) {
        this.setData({
            startX: e.changedTouches[0].clientX,
            moveX: 0,
            currentIndex: e.currentTarget.dataset.index
        });
        // 关闭之前已经展开的删除按钮
        this.data.ims.forEach((item, index) => {
            if (index !== this.data.currentIndex && item.translateX < 0) {
                item.translateX = 0;
            }
        });
        this.setData({
            ims: this.data.ims
        });
    },

    //滑动出现删除
    touchMove: function (e) {
        const moveX = e.changedTouches[0].clientX;
        const diffX = moveX - this.data.startX;
        const translateX = Math.max(-80, Math.min(0, diffX)); // 控制滑动范围
        const {
            ims,
            currentIndex
        } = this.data;
        if (currentIndex !== -1) {
            ims[currentIndex].translateX = translateX;
            this.setData({
                ims
            });
        }
    },

    // 滑动结束
    touchEnd: function (e) {
        const {
            ims,
            currentIndex,
            threshold
        } = this.data;
        if (currentIndex !== -1) {
            if (ims[currentIndex].translateX < -threshold) {
                ims[currentIndex].translateX = -80; // 完全显示删除按钮
            } else {
                ims[currentIndex].translateX = 0; // 恢复到初始位置
            }
            this.setData({
                ims,
                currentIndex: -1
            });
        }
    },

    //点击删除
    deleteItem: function (e) {
        const {
            index,
            im
        } = e.currentTarget.dataset;
        let _this = this
        wx.showModal({
            title: '删除联系人提示',
            content: '移除联系人后,所有相关资源均不可见',
            success(res) {
                if (res.confirm) {
                    rmIm(im).then(async res => {
                        console.log(1111, index, im, res);
                        let ims = await Ims()
                        ims[index].translateX = 0;
                        _this.setData({
                            ims
                        });
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    

    // 打开分享
    addIms: function (e) {
        let _this = this
        wx.showActionSheet({
            itemList: ['创建对话', '创建群聊'],
            success(res) {
                console.log(res.tapIndex+1)
                _this.setData({
                    modelA: true,
                    imtype:res.tapIndex+1
                })
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    onMode:function(){
        this.setData({
            modelA: !this.data.modelA,
        })
    },

    //分享联系人
    childCatchTap() {
        console.log('分享');
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
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
        let {
            ims,
            title
        } = e.currentTarget.dataset
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
            loadin: false
        })
    },

    //加载信道
    loadSocket(id) {
        const socket = io(socketUrl);
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
        const systemInfo = wx.getWindowInfo();
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        this.setData({
            headerHeight: menuButtonInfo.top,
            headerRight: menuButtonInfo.width+20,
            availableWidth: systemInfo.screenWidth,
            availableHeight: systemInfo.windowHeight - (menuButtonInfo.top + menuButtonInfo.height) - 7,
        })
        console.log('处理链接参数',menuButtonInfo,this.data.headerHeight,this.data.availableWidth,this.data.availableHeight);
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
        app.globalData.codeLoad.then(async res => {
            let user = await userMsg()
            console.log('用户信息', user);
            this.setData({
                user: user
            })
            await upUserMsg({
                online: true
            }) //跟新为在线
            this.loadData() //加载信道数据页面
            this.loadSocket(user.id) //链接信道

        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: async function () {
        await upUserMsg({
            online: false
        })
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
        console.log("触发用户转发,");
        postIm(1).then(res => {
            console.log(111, res);
        })
        // return {
        //     title: '转发标题',
        //     path: '/page/index?id=123'
        // }
    },
    onPostIm() {
        //模拟转发
        postIm(1).then(ims => {
            console.log('新建信道', ims._id);
        })
    }
})