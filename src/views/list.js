import {
    ActivityIndicator,
    Button,
    FlatList,
    Image,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import {Component, useEffect, useRef, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Btn} from "../component/btn";
import {Portrait} from "../component/Portrait";
import {_List, postUser} from "../Api";

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from "@react-navigation/native";




export function List({navigation}){

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC

    const [load,setLoad] = useState(false)
    // const [list,setList] = useState(Array)

    useFocusEffect(
        React.useCallback(()=>{

            console.log('监听联系人列表')
            AsyncStorage.getItem('tokenIn').then( async tokenIn=>{
                let time = Date.parse(new Date())/1000
                if(time<tokenIn){
                    console.log('获取token', await AsyncStorage.getItem('token'))
                    // _List(setList)
                }else {
                    console.log('登陆过期，重新登陆')
                }
            })

            // 设置导航头
            navigation.setOptions({
                title:"小船im",
                headerLeft: () => <Btn text={'📬'} fs={18} press={()=>navigation.navigate('Add')} />,
                headerRight: () => <Btn text={'😯'} fs={20} press={()=>navigation.navigate('Me')} />,
            })

            return  ()=>{
                console.log('卸载列表，断开链接')
            }
        },[])
    )

    return <View style={[styles.List,C1]}>

        {list.length?<FlatList data={list}
                               ItemSeparatorComponent={()=><View style={[BbC,styles.listBbC]}></View>}
                               refreshing={load}
                               onRefresh={()=>{
                                   setLoad(true)
                                   setTimeout(()=>{
                                       setLoad(false)
                                   },300)
                               }}
                               renderItem={()=><TouchableOpacity style={[styles.ListRow]}
                                                                 onPress={()=>navigation.navigate('Im')}>
                                   <Portrait w={38} h={38} r={3} t={'😢'}/>
                                   <View style={[styles.ListLi]} >
                                       <Text style={[styles.T4,C2,styles.bold]}>联系人 </Text>
                                       <Text style={[styles.T5,C2,styles.bold,{opacity:0.6}]}>对话内容</Text>
                                   </View>
                                   <Text style={[styles.T6,C2,styles.bold,{marginRight:10,opacity:0.3}]}> 30分钟前 </Text>
                               </TouchableOpacity>}/>:<Text>什么都么有</Text>}



    </View>
}

const list = [
    {key:1},
    {key:2},
    {key:3},
    {key:4},
    {key:5},
    {key:6},
    {key:7},
    {key:8},
    {key:11},
    {key:22},
    {key:33},
    {key:44},
    {key:51},
    {key:61},
    {key:71},
]

