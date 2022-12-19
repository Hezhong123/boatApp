import {Alert, FlatList, Text, TextInput, useColorScheme, View} from "react-native";
import {styles} from "../css";
import * as React from "react";
import {_Activation, _Ticket} from "../_Api";
import {useState} from "react";

export const Ticket = ({navigation})=>{

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC
    const MeBbc = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色

    const [list,setList] = useState([])     //激活码列表
    const [inp,setInp] = useState('')   //输入内容

    navigation.addListener('focus',()=>{
        _Activation(list=>{
            console.log('激活码', list)
            setList(list)
        })
    })


    return <View style={[C1,styles.jMa]}>
        <Text style={[styles.T4,styles.bold, MstText]}> 使用激活码</Text>
        <View style={styles.jMaSend}>
            <TextInput value={inp} onChangeText={text=>setInp(text)} style={[{backgroundColor: MsgColorTouchable}, styles.jMaInput]}/>

            <Text style={styles.jMaBtn} onPress={() => {
                console.log(inp)
                inp.length? _Ticket(inp,cb=>{
                    Alert.alert('激活结果', cb.msg, [
                        {
                            text: 'ok',
                            onPress: () => _Activation(list=>setList(list))
                        }
                    ])
                }):''
            }}>激活</Text>
        </View>

        <Text style={[styles.T4,styles.bold, MstText,{marginBottom:15}]}>解锁记录 </Text>
        <FlatList
            data={list}
            ItemSeparatorComponent={() => <View style={[BbC, styles.listBbC]}></View>}
            renderItem={({item,index})=> <View style={styles.jMList}>
                <Text style={[styles.T5, MstText,styles.jMLists]}>No{index+1}:{platformFun(item.platform)};激活至{memberFun(item.member)} </Text>
            </View>
        }
        />

    </View>
}


let platformFun = (int)=>{
    switch (int){
        case 1:
            return '关注抖音，获得7天时长'
            break;
        case 2:
            return '关注bibi，获得7天时长'
            break;
        case 3:
            return '关注快手，获得7天时长'
            break;
        case 4:
            return '关注小红书，获得7天时长'
            break;
        case 5:
            return '关注视频号，获得7天时长'
            break;
        case 6:
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
