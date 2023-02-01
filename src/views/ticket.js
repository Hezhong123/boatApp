import {Alert, FlatList, Text, TextInput, useColorScheme, View} from "react-native";
import {bColor, fColor, MsgColor, MsgColorTouchable, MstText, placeholderColor, styles} from "../css";
import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {_Activation, _Ticket, _UseTicket} from "../utils/Api";

export function Ticket({navigation}) {
    const schemes = useColorScheme();
    const [list, setList] = useState([])     //激活码列表
    const [inp, setInp] = useState('')   //输入内容

    useFocusEffect(
        useCallback(() => {
            _Activation().then(cb => {
                setList(cb)
            })
        }, []))

    return (
        <View style={[styles.jMa, bColor(schemes)]}>
            <Text style={[styles.T4, styles.bold, MstText(schemes)]}> 使用激活码</Text>
            <View style={styles.jMaSend}>
                <TextInput style={[MsgColor(schemes), MstText(schemes), styles.jMaInput]}
                           placeholder={'输入激活码'}
                           placeholderTextColor={placeholderColor(schemes)}
                           onSubmitEditing={({nativeEvent: {text, eventCount, target}}) => _Ticket(text)
                               .then(cb =>
                                   Alert.alert(`激活码-${cb.state ? '【未使用】' : '【已过期】'}`, `${cb.text}-${cb.day}天时长`, [
                                       cb.state?
                                       {
                                           text: '使用',
                                           onPress: () => _UseTicket(cb._id).then(res => {
                                               Alert.alert(res.msg,'',[
                                                   {
                                                       text:'确定',
                                                       onPress:()=> _Activation().then(list => {
                                                               setList(list)
                                                           })
                                                   }
                                               ])
                                           })
                                       }:{},
                                       {
                                           text: '取消',
                                           onPress: () =>{}
                                       }
                                   ]))}
                />

            </View>

            <Text style={[styles.T6, styles.bold, MstText(schemes), {
                marginBottom: 25,
                opacity: 0.6
            }]}>关注视频平台可获得激活码，点赞留言有机会抽奖年票 </Text>

            <Text style={[styles.T4, styles.bold, MstText(schemes), {marginBottom: 15}]}>使用记录</Text>
            <FlatList
                data={list}
                ItemSeparatorComponent={() => <View style={[bColor(schemes), styles.listBbC]}></View>}
                renderItem={({item, index}) => <View style={styles.jMList}>
                    <Text
                        style={[styles.T5, MstText(schemes), styles.jMLists]}>No{index + 1}【{item.text}】获得{item.cycle}天;激活至{memberFun(item.member)} </Text>
                </View>
                }
            />
        </View>
    )
}

let memberFun = (t) => {
    let time = new Date(t)
    return time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日'
}
