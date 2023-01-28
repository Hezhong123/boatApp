import {Alert, FlatList, Text, TextInput, useColorScheme, View} from "react-native";
import {bColor, fColor, MsgColor, MsgColorTouchable, MstText, placeholderColor, styles} from "../css";
import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {_Activation, _Ticket} from "../utils/Api";

export function Ticket({navigation}){
    const schemes = useColorScheme();
    const [list,setList] = useState([])     //激活码列表
    const [inp,setInp] = useState('')   //输入内容

    useFocusEffect(
        useCallback(()=>{
            _Activation().then(cb=>{
                setList(cb)
            })

        },[]))

    return (
        <View style={[styles.jMa, bColor(schemes)]}>
            <Text style={[styles.T4,styles.bold, MstText(schemes)]}> 使用激活码</Text>
            <View style={styles.jMaSend}>
                <TextInput style={[MsgColor(schemes), MstText(schemes), styles.jMaInput]}
                           placeholder={'输入激活码'}
                           placeholderTextColor={placeholderColor(schemes)}
                           onSubmitEditing={({nativeEvent: {text, eventCount, target}})=> _Ticket(text)
                               .then(cb=>Alert.alert('激活结果', cb.msg,[
                               {
                                   text:'ok',
                                   onPress:()=>_Activation().then(list=>setList(list))
                               }
                           ]))}
                />

            </View>

            <Text style={[styles.T6,styles.bold, MstText(schemes),{marginBottom: 25,opacity:0.6}]}>关注视频平台可获得激活码，点赞留言有机会抽奖年票 </Text>

            <Text style={[styles.T4,styles.bold, MstText(schemes),{marginBottom:15}]}>解锁记录 </Text>
            <FlatList
                data={list}
                ItemSeparatorComponent={() => <View style={[bColor(schemes), styles.listBbC]}></View>}
                renderItem={({item,index})=> <View style={styles.jMList}>
                    <Text style={[styles.T5, MstText(schemes),styles.jMLists]}>No{index+1}:{platformFun(item.platform)};激活至{memberFun(item.member)} </Text>
                </View>
                }
            />
        </View>
    )
}

let platformFun = (int)=>{
    switch (int){
        case 0:
            return '关注bibi，获得7天时长'
            break;
        case 1:
            return '关注抖音，获得7天时长'
            break;
        case 2:
            return '关注视频号，获得7天时长'
            break;
        case 3:
            return '关注小红书，获得7天时长'
            break;
        case 4:
            return '关注快手，获得7天时长'
            break;
        case 5:
            return '在bibi留言中奖，获得1年时长'
            break;
        default:
            return ;
    }
}

let memberFun = (t)=>{
    let time =  new Date(t)
    return time.getFullYear()+'年'+(time.getMonth()+1)+'月' + time.getDate()+'日'
}
