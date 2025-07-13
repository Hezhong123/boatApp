import {request} from './request'

// export const socketUrl= 'http://192.168.1.4:3007'
export const  socketUrl= "https://im.xldkeji.com"

// 获取用户信息
export const userMsg  = () =>{
    return request({
        url:'/user',
        method: 'GET',
    })
}  

//获取小程序吗
export const userQRCode  = () =>{
    return request({
        url:`/user/qrCode`,
        method: 'POST',
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

//查看名片邀请
export const postImUser = (id) =>{
    return request({
        url:`/ims/user/${id}`,
        method: 'GET'
    })
}

//链接加群
export const postImUsers = (id) =>{
    return request({
        url:`/ims/users/${id}`,
        method: 'GET'
    })
}

// 加入对话信道
export const postIm = (id) =>{
    return request({
        url:`/ims/add/${id}`,
        method: 'POST'
    })
}



//创建群聊
export const postIms = (name) =>{
    return request({
        url:`/ims/adds`,
        method: 'POST',
        data:{imName:name}
    })
}

//加入群聊
export const addIms = (id) =>{
    return request({
        url:`/ims/adds/${id}`,
        method: 'POST'
    })
}

//删除信道
export const rmIm =(im) =>{
    return request({
        url:`/ims/rm/${im}`,
        method: 'PATCH'
    })
}

//删除信道
export const rmImUser =(im,user) =>{
    return request({
        url:`/ims/rmIms/${im}/${user}`,
        method: 'PATCH'
    })
}


//信道ID
export const ImsId = (id) => {
    return request({
        url:`/ims/id/${id}`,
        method: 'GET'
    })
}

//修改信道名称
export const ImsName = (id,name) => {
    return request({
        url:`/ims/name/${id}`,
        method: 'PUT',
        data:{imName:name}
    })
}
//信道消息
export const imMsg =  (im) => {
    return request({
        url:`/msg/${im}`,
        method: 'GET'
    })
}
//删除信息
export const delMsg =  (im) => {
    return request({
        url:`/msg/${im}`,
        method: 'DELETE'
    })
}

//词语列功能
export const msgEn =  (q) => {
    return request({
        url:`/msg/en`,
        method: 'POST',
        data:{"q":q}
    })
}

// 词列功能
export const msgWord =  (q) => {
    return request({
        url:`/msg/en`,
        method: 'POST',
        data:{"q":q}
    })
}

//跟读功能
export const msgTts =  (id,enQ) => {
    return request({
        url:`/msg/tts`,
        method: 'POST',
        data:{
            "msgId":id,
            "enQ":enQ
        }
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

export const PayParams = (key)=>{
    return request({
        url:`/orders/PayParams`,
        method: 'GET'
    })
}

// 查询收藏
export const getCollect = ()=>{
    return request({
        url:`/collect`,
        method: 'GET'
    })
}

//创建收藏
export const postCollect = (msgId)=>{
    return request({
        url:`/collect/${msgId}`,
        method: 'POST'
    })
}

//删除收藏
export const delCollect = (msgId)=>{
    return request({
        url:`/collect/${msgId}`,
        method: 'DELETE'
    })
}