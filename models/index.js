import {request} from './request'


// 获取用户信息
export const userMsg  = () =>{
    return request({
        url:'/user',
        method: 'GET',
    })
}  

// 修改用户信息
export const upUserMsg  = (obj) =>{
    return request({
        url:'/user',
        method: 'PUT',
        data:obj
    })
}  

//信道列表
export const Ims = () => {
    return request({
        url:'/ims',
        method: 'GET'
    })
}

//信道消息
export const imMsg =  (im) => {
    return request({
        url:`/msg/${im}`,
        method: 'GET'
    })
}

// 微信cos签名
export const cosToken = (key,path) =>{
    return request({
        url:'/cos/authorizationWeCat',
        method: 'POST',
        data:{key,path}
    })
}