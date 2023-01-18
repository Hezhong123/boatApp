import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const ip = '192.168.0.101:3000'
export const url = "https://boatim.xldkeji.com"
export const wss = "wss://boatim.xldkeji.com"
export const oss = 'https://boatim.oss-cn-shanghai.aliyuncs.com'
const instance = axios.create({
    baseURL: url,
    timeout: 3000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});


//用户信息
export const _User = ()=> new Promise(async (user) => {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get('/user').then(res => {
        user(res.data)
    }, err => {
        console.log('用户信息1', err)
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
        cb()
    },err=>{
        console.log('收藏失败', err)
    })
})

