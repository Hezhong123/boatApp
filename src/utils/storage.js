import {_List, _User} from "./Api";
import {Asset} from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Login} from "../views/login";

// 存储用户信息
export const user_storage = async () => {
    let user = await _User()
    let avatar = await Asset.fromModule(user.avatar).downloadAsync()
    user.avatar = avatar.localUri
    await AsyncStorage.setItem('user', JSON.stringify(user))
}


//存储联系人列表
export const list_storage = async (list) => {
    list.map(async (item, i) => {
        item.userArr.map(async (items, s) => {
            let userAvatar = await Asset.fromModule(items.avatar).downloadAsync()
            items.avatar = userAvatar.localUri
        })
        if (i == list.length - 1) {
            setTimeout(async () => {
                await AsyncStorage.setItem('list', JSON.stringify(list))
            }, 100)
        }
    })
}

//离线对话消息
export const im_storage = async (list,msg,imTitle)=>{
    msg.map(async (item, i) => {
        // if(item.url && item.url != 'null'){
        //     let url = await Asset.fromModule(item.url).downloadAsync()
        //     item.url = url.localUri
        // }
        // console.log('离线对话',item)
        // if(i == msg.length -1){
        //     setTimeout(async () => {
        //
        //     }, 100)
        // }
        let data ={
            title:imTitle,
            msgArr:msg
        }
        await AsyncStorage.setItem(list, JSON.stringify(data))
    })
    // console.log('离线对话', imTitle,msg)
}

