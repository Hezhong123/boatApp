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

//信道ID
export const ImsId = (id) => {
    return request({
        url:`/ims/id/${id}`,
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

//跟新信道时间
export const msgTime =  (id) => {
    return request({
        url:`/msg/time/${id}`,
        method: 'PUT'
    })
}

//未读消息跟新
export const imsUnread = (im) =>{
    return request({
        url:`/ims/unread/${im}`,
        method: 'PUT'
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

// 订单查询
export const orderLi = ()=>{
    return request({
        url:`/orders`,
        method: 'GET'
    })
}

//激活码查询
export const getCode =(key)=>{
    return request({
        url:`/orders/code/${key}`,
        method: 'GET'
    })
}

// 激活码激活
export const postCode =(key)=>{
    return request({
        url:`/orders/code/${key}`,
        method: 'POST'
    })
}