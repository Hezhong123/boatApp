import {FlatList, Text, TextInput, TouchableHighlight, useColorScheme, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {styles} from "../css";
import {Portrait} from "../component/Portrait";
import * as React from "react";
import { useFocusEffect } from '@react-navigation/native';
import {_User} from "../_Api";

export function Me({navigation}){
    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2

    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const MeBbc = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框

    const [load, setLoad] = useState(false)
    const [user,setUser] = useState({})
    useFocusEffect(
        useCallback(() => {
            console.log('更新用户信息')
            _User(setUser)
            return () => {
                console.log('离开我的',)
            };
        }, [])
    );

    return <View style={[styles.Me,C1]}>
        {/*个人信息*/}

        <View style={styles.MeUse} >
            <TouchableHighlight
                underlayColor={MsgColorTouchable}
                onPress={()=>{
                    console.log('更换头像')
                    navigation.navigate('Login')
                }}>
                <Portrait w={52} h={52} r={50} t={'😢'} url={user.avatar}/>
            </TouchableHighlight>

             <View style={styles.MeUseText}>
                 <TouchableHighlight
                     underlayColor={MsgColorTouchable}
                     onPress={()=>{
                     console.log('修改昵称')
                 }}>
                     <Text style={[styles.T3,styles.bold,C2]}>{user.name}</Text>
                 </TouchableHighlight>
                 <Text style={[styles.T5,C2,styles.bold,{opacity:0.9,marginTop:6}]} >🆔 {user.id} </Text>
             </View>
        </View>

        {/*搜索收藏*/}
        <View style={[styles.MeInput,MeBbc]}>
            <Text style={[MstText,styles.T5,styles.bold]}>🔍 收藏夹</Text>
            <TextInput defaultValue={'内容'} style={[styles.MeInputs,styles.T6,MstText]}/>
        </View>

        <FlatList
            data={[1,2,1,1,1,2,1,1,1,2,1,1]}
            refreshing={load}
            onRefresh={()=>{
                console.log('下啦刷新')
            }}
            renderItem={(i)=><View style={[styles.ImMsg,{marginLeft: 15}]}>
                <Portrait w={32} h={32} r={7} t={'😢'}/>
                <LeftMsg type={1}/>
            </View>}
        />
    </View>
}


function LeftMsg(props) {
    const {type} = props
    const colorScheme = useColorScheme();
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const lightNsgBcB = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框分割线

    switch (type) {
        case 1:
            return <View style={[styles.msgRow]}>
                <View style={[styles.msgText, MsgColor]}>
                    <TouchableHighlight activeOpacity={0.3}
                                        underlayColor={MsgColorTouchable}
                                        onPress={() => console.log('111')}>
                        <Text style={[styles.T5, styles.zh, MstText, lightNsgBcB]}> 你好世界</Text>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable} onPress={() => {
                    }}>
                        <Text style={[styles.T6, MstText, styles.en, {opacity: 0.8}]}> hello， worid</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable}>
                    <Text style={[styles.msgAudio, styles.T5]}> 🎵</Text>
                </TouchableHighlight>
            </View>
            break;
        case 2:
            return <View style={[styles.msgRow]}>
                <TouchableHighlight style={[styles.msgText, MsgColor]} activeOpacity={0.3}
                                    onPress={() => {
                                    }}
                                    underlayColor={MsgColorTouchable}>
                    <Text style={[styles.T5, styles.en, MstText]}> 34 "</Text>
                </TouchableHighlight>
            </View>
            break;
        case 3:
            return <View style={[styles.msgRow]}>
                <TouchableHighlight activeOpacity={0.5}
                                    underlayColor={MsgColorTouchable}
                                    onPress={() => {
                                    }}>
                    <MsgImg/>
                </TouchableHighlight>
            </View>
            break;
    }


}
