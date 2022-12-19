import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';

export const ip = '192.168.0.102'

const instance = axios.create( {
    baseURL: `http://${ip}:3000`,
    timeout: 1000,
    headers: {
        Accept: 'application/json',
        'Content-Type':'application/json'
    }
});

// 登陆
export function _Login(tel,cb){
    instance.post('/user',{tel:tel}).then(res=>{
        AsyncStorage.setItem('token', res.data.token)
        AsyncStorage.setItem('tokenIn', String(res.data.expiresIn))
        cb(res.data)
    })
}

//用户信息
export const _User = async (cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    await instance.get('/user').then(res=>{
        console.log('用户ID:',res.data.id)
        cb(res.data)
    },err=>{
        console.log('错误',err)
    })
}

//搜索用户
export const _Quser = async (key,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`/user/query?key=${key}`).then(res=>{
        console.log('搜索用户',res.data)
        cb(res.data)
    })

}


//获取信道
export const _List = async (cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`/list`).then(res=>{
        cb(res.data)
    },err=>{
        console.log('获取信道错误',err)
    })
}


//信道参数
export const _ListId = async (id,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`/list/obj/${id}`).then(res=>{
        cb(res.data)
    },err=>{
        console.log('错误',err)
    })
}

// 非好友信道
export const _ListNull = async (cb) =>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get('/list/null').then(res=>{
        console.log('非联系人列表', res.data.length)
        cb(res.data)
    },err=>{
        console.log('错误',err)
    })
}

//添加好友
export const _AddList = async  (userId,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post('list/im' ,{userId:userId}).then(res=>{
        console.log('添加好友',res.data)
        cb(res.data)
    },err=>{
        console.log('添加失败',err)
    })
}

//创建群聊
export const _Ims = async (title,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post('list/ims' ,{title:title}).then(res=>{
        cb(res.data)
    },err=>{
        console.log('添加失败',err)
    })
}

// 最近联系人
export const _Contact = async (cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post('/list/contact' ).then(res=>{
        cb(res.data)
    },err=>{
        console.log('最近联系人',err)
    })
}

//加入群聊
export const _AddIms = async (list,id,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`/list/addIms/${list}/${id}` ).then(res=>{
        cb(res.data)
    },err=>{
        console.log('最近联系人',err)
    })
}

// 退出群聊
export const _QuitIms = async (list,id,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`/list/quitIms/${list}/${id}` ).then(res=>{
        cb(res.data)
    },err=>{
        console.log('最近联系人',err)
    })
}

//解散群
export const _OutIms = async (list,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.delete(`/list/outIms/${list}` ).then(res=>{
        cb(res.data)
    },err=>{
        console.log('最近联系人',err)
    })
}


//通过申请11
export const _AddIm = async (list,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`list/addIM/${list}` ).then(res=>{
        console.log('通过申请',res.data)
        cb()
    },err=>{
        console.log('通过申请失败',err)
    })
}

//拒绝申请
export const _DelIm = async (list) =>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.delete(`list/delIM/${list}` ).then(res=>{
        console.log('拒绝申请',res.data)
    },err=>{
        console.log('拒绝申请失败',err)
    })
}

// 加载对话内容
export const _Msg= async (list,page,cd)=>{
    instance.get(`list/msg/${list}/${page}`).then(res=>{
        // console.log('聊天记录',res.data.length)
        cd(res.data.reverse())
    })
}

// 更新未读
export const _Unread = async (list,user)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`list/unread/${list}/${user}`).then(res=>{
        console.log('更新未读',res.data)
    })
}

// 跟新时间戳
export const _ImTime = async (list)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`list/time/${list}`).then(res=>{
        // console.log('更新时间戳',res.data)
    })
}

//词裂
export const _Column= async (q,cb)=> {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`list/column/${q}`).then(enQ => {
        cb(enQ.data)
    })
}

//跟读
export const _Listen = async (im,enQ,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`list/listen`,{
        im:im,
        enQ:enQ
    }).then(res => {
        cb(res.data)
    })
}

//开关词裂
export const _onColumn = async (boolean,user)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/column/${boolean}`).then(res => {
        console.log('开关词裂',res.data)
        user(res.data)
    })
}

//开关跟读
export const _onListen = async (boolean,user)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/listen/${boolean}`).then(res => {
        console.log('开关跟读',res.data)
        user(res.data)
    })
}

//修改头像
export const _avatar = async (url,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/avatar`,{'url':url}).then(res => {
        cb(res.data)
    })
}

//修改昵称
export const _name = async (name,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/name/${name}`).then(res => {
        // console.log('更新未读',res)
        cb(res.data)
    })
}

//修改昵称
export const _emoji = async (e,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/emoji/${e}`).then(res => {
        // console.log('更新未读',res)
        cb(res.data)
    })
}

//新建收藏
export const _addStore = async (obj)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`store`,obj)
}

//查询收藏
export const _storeLi = async (cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`store`).then(res => {
        // console.log('收藏信息',res)
        cb(res.data)
    })
}

//删除收藏
export const _storeDel = async (id,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.delete(`store/${id}`).then(res => {
        // console.log('收藏信息',res)
        cb(res.data)
    })
}

//搜索内容
export const _storeQuery = async (text,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`store/${text}`).then(res => {
        cb(res.data)
    })
}

// 激活码使用记录
export const _Activation = async (cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`activation`).then(res => {
        cb(res.data)
    })
}

export const _Ticket = async (Ma,cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`activation/ticket`,{'ticketMa':Ma}).then(res => {
        cb(res.data)
    })
}

