import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';


const instance = axios.create( {
    baseURL: 'http://192.168.0.104:3000',
    timeout: 1000,
    headers: {
        Accept: 'application/json',
        'Content-Type':'application/json'
    }
});

// 登陆
export function _Login(tel){
    instance.post('/user',{tel:tel}).then(res=>{
        console.log('登陆',res.data)
        AsyncStorage.setItem('token', res.data.token)
        AsyncStorage.setItem('tokenIn', String(res.data.expiresIn))
    })
}

//用户信息
export const _User = async (cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    await instance.get('/user').then(res=>{
        console.log('用户:',res.data.id)
        cb(res.data)
    },err=>{
        console.log('错误',err)
    })
}

//搜索用户
export const _Quser = async (set,key)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get(`/user/query?key=${key}`).then(res=>{
        console.log('搜索用户',res,key)
        set(res.data)
    })

}


//获取信道
export const _List = async (cb)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get('/list').then(res=>{
        cb(res.data)
    },err=>{
        console.log('错误',err)
    })
}

// 非好友信道
export const _ListNull = async (set) =>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.get('/list/null').then(res=>{
        console.log('非联系人列表', res.data.length)
        set(res.data)
    },err=>{
        console.log('错误',err)
    })
}

//添加好友
export const _AddList = async  (userId)=>{
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post('list/im' ,{userId:userId}).then(res=>{
        console.log('添加好友',res.data)
    },err=>{
        console.log('添加失败',err)
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
export const _Msg= async (list,cd)=>{
    instance.get(`list/msg/${list}`).then(res=>{
        // console.log('聊天记录',res.data.length)
        cd(res.data.reverse())
    })
}

// 更新未读
export const _Unread = async (list,user)=>{
    console.log('222', list, user)
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`list/unread/${list}/${user}`).then(res=>{
        // console.log('更新未读',res)
    })
}

//词裂
export const _Column= async (q,cb)=> {
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.post(`list/column/${q}`).then(enQ => {
        // console.log('更新未读',res)
        cb(enQ.data)
    })
}

//开关词裂
export const _onColumn = async (boolean,user)=>{
    console.log(boolean)
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/column/${boolean}`).then(res => {
        console.log('qr',res)
        user(res.data)
    })
}

//开关跟读
export const _onListen = async (boolean,user)=>{
    console.log(boolean)
    instance.defaults.headers['authorization'] = `Bearer ${await AsyncStorage.getItem('token')}`;
    instance.put(`user/listen/${boolean}`).then(res => {
        console.log('更新未读',res)
        user(res.data)
    })
}
