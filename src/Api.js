let url = 'http://localhost:3000'

import AsyncStorage from '@react-native-async-storage/async-storage';


function _Get(api){
    return new Promise( async (res,err)=>{
        console.log('token', await AsyncStorage.getItem('token'))
        fetch(url+api,{
            method: 'Get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type':'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => res(json))
            .catch((error) => err(error))
    })
}

function _Post(api,data){
    return new Promise( async (res,err)=>{
        fetch(url+api,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((json) => res(json))
            .catch((error) => err(error))
    })

}

//登陆
export const _Login =  async (tel,cb)=>{
    _Post('/user',{tel:"18487249198"}).then(res=>{
        AsyncStorage.setItem('token', res.token)
        AsyncStorage.setItem('tokenIn', String(res.expiresIn))
        cb(res)
    },err=>{

    })
}


//获取信道
export const _List = (set)=>{
    _Get('/list').then(res=>{
        console.log('信道',res)
        set(res)
    },err=>{
        console.log('错误',err)
    })
}


// 用户信息
export const _User = (set)=>{
    _Get('/user').then(res=>{
        console.log('用户信息',res)
        set(res)
    },err=>{
        console.log('用户信息错误',err)
    })
}


//搜索用户
export const _QueryUser = (set,key)=>{
    _Get(`/user/query?key=${key}`).then(res=>{
        console.log('搜索用户',res)
        set(res)
    },err=>{
        console.log('搜索失败',err)
    })
}

