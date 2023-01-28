import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const url = 'http://192.168.2.187:3000'
// export const wss = 'http://192.168.2.187:3000'

export const url = "https://www.boatim.top"
export const wss = "wss://www.boatim.top"
export const oss = 'https://boatim.oss-cn-shanghai.aliyuncs.com'
const instance = axios.create({
    baseURL: url,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
});


//用户信息
export const _User = ()=> new Promise(async (user) => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get('/user').then(res => {
        user(res.data)
    }, err => {
        console.log('用户信息', err)
    })
})

//获取非好友联系人
export const _ListNull = ()=> new Promise(async list => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get('/list/null').then(res => {
        list(res.data)
    }, err => {
        console.log('获取非好友联系人错误', err)
    })
})

//获取联系人
export const _List = ()=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`list`).then(res => {
        cb(res.data)
    }, err => {
        console.log('获取信道错误', err)
    })
})



//修改表情包
export const _Emoji = (item)=> new Promise(async emoji=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/emoji/${item}`).then(res => {
        // console.log('更新未读',res)
        emoji(res.data)
    })
})

//修改头像
export const _Avatar = (url)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/avatar`, {'url': url}).then(res => {
        cb(res.data)
    })
})

//修改昵称
export const _Name =  (name)=> new  Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/name/${name}`).then(res => {
        // console.log('更新未读',res)
        cb(res.data)
    })
})

//收藏列表
export const _StoreLi = ()=> new Promise(async li => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`store`).then(res => {
        // console.log('收藏信息',res)
        li(res.data)
    },err=>{

    })
})

//搜索收藏内容
export const _StoreQuery = (text) => new Promise(async li => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`store/${text}`).then(res => {
        li(res.data)
    },err=>{
        console.log('查询收藏错误', err)
    })
})

//删除收藏
export const _StoreDel  = (id) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.delete(`store/${id}`).then(res => {
        cb(res.data)
    }, err => {
        console.log('移除收藏错误', err)
    })
})


//获取图形验证码
export const _Graphic = (tel) => new Promise(cb=>{
    instance.get(`user/graphic/${tel}`,).then(res => {
        cb(res.data)
    },err=>{
        console.log('获取图形验证码失败', err)
    })
})

//获取短信验证码
export const _Sms = (tel) => new Promise(cb=>{
    instance.post(`user/sms`, {
        tel: tel
    }).then(res => {
        cb(res.data)
    },err=>{
        console.log('获取短信失败', err)
    })
})

// 短信登陆
export const _SmsLogin = (tel, sms) => new Promise(cb=>{
    instance.post(`user/smsLogin`, {
        sms: sms,
        tel: tel
    }).then(async res => {
        if (res.data == '请核对验证码') {
            cb(res.data)
        } else {
            await AsyncStorage.setItem('token', res.data.token)
            await AsyncStorage.setItem('tokenIn', String(res.data.expiresIn))
            cb(res.data)
        }

    })
})

//搜索用户
export const _Query = async (key) => new Promise(async (cb) => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`/user/query?key=${key}`).then(res => {
        console.log('搜索用户', res.data)
        cb(res.data)
    })
})

//添加好友
export const _AddList =(userId) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post('list/im', {userId: userId}).then(res => {
        cb(res.data)
    }, err => {
        console.log('添加失败', err)
    })
})

//同意申请
export const _AddIm =(list) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`list/addIM/${list}`).then(res => {
        console.log('同意申请', res.data)
        cb(res.data)
    }, err => {
        console.log('通过申请失败', err)
    })
})


//拒绝申请
export const _DelIm = (list) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.delete(`list/delIM/${list}`).then(res => {
        console.log('拒绝申请', res.data)
        cb(res.data)
    }, err => {
        console.log('拒绝申请失败', err)
    })
})

//创建群聊
export const _Ims = (title)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post('list/ims', {title: title}).then(res => {
        cb(res.data)
    }, err => {
        console.log('添加失败', err)
    })
})

//新到内容
export const _ListId = (id) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`/list/obj/${id}`).then(res => {
        cb(res.data)
    }, err => {
        console.log('错误', err)
    })
})

// 加载对话内容
export const _Msg= (list,page)=>new Promise(cb=>{
    instance.get(`list/msg/${list}/${page}`).then(res=>{
        cb(res.data.reverse())
    },err=>{
        console.log('加载对话', err)
    })
})

//词裂
export const _Column= (q)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`list/column/${q}`).then(enQ => {
        cb(enQ.data)
    })
})

//跟读
export const _Listen = (im,enQ)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`list/listen`, {
        im: im,
        enQ: enQ
    }).then(res => {
        cb(res.data)
    })
})

//开关词裂
export const _OnColumn =  (boolean)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/column/${boolean}`).then(res => {
        console.log('开关词裂', res.data)
        cb(res.data)
    })
})

//开关跟读
export const _OnListen = (boolean) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/listen/${boolean}`).then(res => {
        console.log('开关跟读', boolean, res.data)
        cb(res.data)
    })
})

// 跟新时间戳
export const _ImTime = (list)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`list/time/${list}`).then(res => {
        cb()
    },err=>{
        console.log('跟新时间戳错误', err)
    })
})

// 更新未读
export const _Unread = (list,user) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`list/unread/${list}/${user}`).then(res => {
        console.log('更新未读', res.data)
        cb()
    },err=>{
        console.log('更新未读', err)
    })
})

//新建收藏
export const _addStore = (obj)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`store`, obj).then(res=>{
        cb(res.data)
    },err=>{
        console.log('收藏失败', err)
    })
})

// 退出群聊
export const _QuitIms =(list,id)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`/list/quitIms/${list}/${id}`).then(res => {
        cb(res.data)
    }, err => {
        console.log('最近联系人', err)
    })
})


// 修改群名称
export const _NameIms =(list,name)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`/list/nameIms/${list}`,{name:name}).then(res => {
        cb(res.data)
    }, err => {
        console.log('最近联系人', err)
    })
})

//解散群
export const _OutIms = (list) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.delete(`/list/outIms/${list}`).then(res => {
        cb(res.data)
    }, err => {
        console.log('最近联系人', err)
    })
})


// 最近联系人
export const _Contact = ()=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post('/list/contact').then(res => {
        cb(res.data)
    }, err => {
        console.log('最近联系人', err)
    })
})

//搜索用户
export const _Quser = (key) => new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`/user/query?key=${key}`).then(res => {
        console.log('搜索用户', res.data)
        cb(res.data)
    })
})

//加入群聊
export const _AddIms = async (list,id,)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`/list/addIms/${list}/${id}`).then(res => {
        cb(res.data)
    }, err => {
        console.log('最近联系人', err)
    })
})

// 激活码使用记录
export const _Activation =  ()=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`activation`).then(res => {
        cb(res.data)
    })
})

//使用激活码
export const _Ticket =  (Ma)=> new Promise(async cb => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`activation/ticket`, {'ticketMa': Ma}).then(res => {
        cb(res.data)
    })
})
