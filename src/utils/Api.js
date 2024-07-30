import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastAndroid from "react-native/Libraries/Components/ToastAndroid/ToastAndroid";
import {Platform} from "react-native";

export const url = 'http://192.168.41.1:3000'
export const wss = 'ws://192.168.41.1:3000'

// export const url = "https://www.boatim.top"
// export const wss = "wss://www.boatim.top"
export const oss = 'https://boatim.oss-cn-shanghai.aliyuncs.com'

export const ToastShow = (t)=>Platform.OS == 'android'?
    ToastAndroid.show(t, ToastAndroid.SHORT):
    ''

//用户信息
export const _User = async () => {
    return fetch(`${url}/user`, {
        method: 'GET',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
            return responseJson.json()
        })
        .catch((error) => {
            console.error('用户信息',error);
            ToastShow('网络链接错误')
            return {}
        });
}

//获取非好友联系人
export const _ListNull = async () => {
    return fetch(`${url}/list/null`, {
        method: 'GET',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
            return responseJson.json()
        })
        .catch((error) => {
            console.error('获取非好友联系人',error);
            ToastShow('网络链接错误')
            return []
        });
}


//获取联系人
export const _List = async () => {
    return fetch(`${url}/list`, {
        method: 'GET',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
            return responseJson.json()
        })
        .catch((error) => {
            console.error('获取联系人',error);
            ToastShow('网络链接错误')
            return []
        });
}


//修改表情包
export const _Emoji = async (item) => {
    return fetch(`${url}/user/emoji/${item}`, {
        method: 'PUT',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
            return responseJson.json()
        })
        .catch((error) => {
            console.error('修改表情包',error);
            ToastShow('网络链接错误')
            return {}
        });
}

//修改头像
export const _Avatar = async (imgUrl) => {
    return fetch(`${url}/user/avatar`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body: JSON.stringify({
            'url': imgUrl
        })
    }).then((responseJson) => {
            return responseJson.json()
        })
        .catch((error) => {
            console.error('修改头像',error);
            ToastShow('网络链接错误')
            return {}
        });
}

//修改昵称
export const _Name = async (name) => {
    return fetch(`${url}/user/name/${name}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
            return responseJson.json()
        })
        .catch((error) => {
            console.error('修改昵称',error);
            ToastShow('网络链接错误')
            return {}
        });
}

//收藏列表
export const _StoreLi = async () => {
    return fetch(`${url}/store`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('收藏列表',error);
        return []
    });
}


//搜索收藏内容
export const _StoreQuery = async (text) => {
    return fetch(`${url}/store/${text}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('搜索收藏内容',error);
        return {}
    });
}

//删除收藏
export const _StoreDel =  async (id) => {
    return fetch(`${url}/store/${id}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.text()
    }).catch((error) => {
        console.error('删除收藏',error);
        return {}
    });
}

export const mail =async (mail)=>{
    return fetch(`${url}/user/mail`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            mail: mail
        })
    }).then((responseJson) => {
        ToastShow('邮件已发送')
        return responseJson.status
    }).catch((error) => {
        console.error('获取邮件验证码',error);
        ToastShow('网络错误')
        return {}
    });
}

// 邮箱登陆
export const MailLogin = async (mail,mailCode) => {
    return fetch(`${url}/user/mailLogin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mailCode: mailCode,
            mail: mail
        })
    }).then((responseJson) => {
        ToastShow('登陆成功')
        return responseJson.json()
    }).catch((error) => {
        console.error('短信登陆',error);
        return {}
    });
}



//获取短信验证码
export const _Sms = async (tel) => {
    return fetch(`${url}/user/sms`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            tel: tel
        })
    }).then((responseJson) => {
        ToastShow('短信已发送')
        return responseJson.status
    }).catch((error) => {
        console.error('获取短信验证码',error);
        ToastShow('网络错误')
        return {}
    });
}


// 短信登陆
export const _SmsLogin = async (tel, sms) => {
    return fetch(`${url}/user/smsLogin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sms: sms,
            tel: tel
        })
    }).then((responseJson) => {
        ToastShow('登陆成功')
        return responseJson.json()
    }).catch((error) => {
        console.error('短信登陆',error);
        return {}
    });
}

//搜索用户
export const _Query = async (key) =>{
    return fetch(`${url}/user/query?key=${key}`,{
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
    }).then((responseJson)=>{
        return responseJson.json()
    }).catch((error) => {
        console.error('搜索用户',error);
        return []
    });
}

//添加好友
export const _AddList = async (userId) => {
    return fetch(`${url}/list/im`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body: JSON.stringify({
            userId: userId
        })
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('添加好友',error);
        return {}
    });
}


//同意申请
export const _AddIm = async (list) => {
    return fetch(`${url}/list/addIM/${list}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.status
    }).catch((error) => {
        console.error('同意申请',error);
        return {}
    });
}



//拒绝申请
export const _DelIm = async (list) => {
    return fetch(`${url}/list/delIM/${list}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.status
    }).catch((error) => {
        console.error('拒绝申请',error);
        return {}
    });
}

//创建群聊
export const _Ims = async (title) => {
    console.log('111', title)
    return fetch(`${url}/list/ims`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body:JSON.stringify({
            title: title
        })
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('创建群聊', error);
        return {}
    })
}




//信道内容
export const _ListId = async (id) => {
    return fetch(`${url}/list/obj/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('信道内容', error);
        return {}
    })
}


// 加载对话内容
export const _Msg = async (list, page) => {
    return fetch(`${url}/list/msg/${list}/${page}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('信道内容', error);
        return []
    })
}

//词裂
export const _Column = async (q) => {
    return fetch(`${url}/list/column/${q}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.text()
    }).catch((error) => {
        console.error('词裂', error);
        return {}
    })
}

//跟读
export const _Listen = async (im, enQ) => {
    return fetch(`${url}/list/listen`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body:JSON.stringify({
            im: im,
            enQ: enQ
        })
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('跟读', error);
        return {}
    })
}

//开关词裂
export const _OnColumn = async (boolean) => {
    return fetch(`${url}/user/column/${boolean}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('开关词裂', error);
        return {}
    })
}

//开关跟读
export const _OnListen = async (boolean) => {
    return fetch(`${url}/user/listen/${boolean}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('开关跟读', error);
        return {}
    })
}

// 跟新时间戳
export const _ImTime = async (list) => {
    return fetch(`${url}/list/time/${list}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.status
    }).catch((error) => {
        console.error('跟新时间戳', error);
        return {}
    })
}

// 更新未读
export const _Unread = async (list, user) => {
    return fetch(`${url}/list/unread/${list}/${user}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.status
    }).catch((error) => {
        console.error('更新未读', error);
        return {}
    })
}

//新建收藏
export const _addStore = async (obj) => {
    return fetch(`${url}/store`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body:JSON.stringify(obj)
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('新建收藏', error);
        return {}
    })
}

// 退出群聊
export const _QuitIms = async (list, id) => {
    return fetch(`${url}/list/quitIms/${list}/${id}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.status
    }).catch((error) => {
        console.error('退出群聊', error);
        return {}
    })
}


// 修改群名称
export const _NameIms = async (list, name) => {
    return fetch(`${url}/list/nameIms/${list}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body:JSON.stringify({name: name})
    }).then((responseJson) => {
        return responseJson.status
    }).catch((error) => {
        console.error('修改群名称', error);
        return {}
    })
}


//解散群
export const _OutIms = async (list) => {
    return fetch(`${url}/list/outIms/${list}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.status
    }).catch((error) => {
        console.error('解散群',error);
        return {}
    });
}


// 最近联系人
export const _Contact = async () => {
    return fetch(`${url}/list/contact`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('最近联系人', error);
        return []
    })
}


//加入群聊
export const _AddIms = async (list, id,) => {
    return fetch(`${url}/list/addIms/${list}/${id}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('加入群聊', error);
        return {}
    })
}

// 激活码使用记录
export const _Activation = async () => {
    return fetch(`${url}/activation`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('加入群聊', error);
        return []
    })
}

//查询激活码
export const _Ticket = async (Ma) => {
    return fetch(`${url}/activation/ticket/${Ma}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('加入群聊', error);
        return {}
    })
}

//使用激活码
export const _UseTicket = async (ticketId) => {
    return fetch(`${url}/activation/use_ticket`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body:JSON.stringify({
            ticketId:ticketId
        })
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('加入群聊', error);
        return {}
    })
}


export const _Authorization = (path,extension)=>{
    // const extension = file.name.split('.').pop().toLowerCase();
    return fetch(`${url}/cos/authorization`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "path":path,
            "key": extension
        })
    }).then((responseJson) => {
        return responseJson.json()
    }).catch((error) => {
        console.error('加入群聊', error);
        return {}
    })
}