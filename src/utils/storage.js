import {_User} from "./Api";
import {Asset} from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 存储用户信息
export async function user_storage() {
    let user = await _User()
    let avatar =  await Asset.fromModule(user.avatar).downloadAsync()
    user.avatar = avatar.localUri
    await AsyncStorage.setItem('user', JSON.stringify(user))
}
