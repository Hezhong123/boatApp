import {Button, FlatList, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View} from "react-native";
import {Component, useEffect, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Portrait} from "../component/Portrait";
import {Btn} from "../component/btn";

export function Add({navigation}){

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const MeBbc = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色

    const [query,setQuery] = useState(false)

    // <Btn text={'🔍'} fs={20} press={()=>setQuery(!query)} />
    useEffect(()=>{
        navigation.setOptions({
            title:"新的朋友",
            headerRight: () => {}
        })
    },[])
    return <View style={[styles.Add,C1]}>

        {query?<View style={[styles.MeInput,MeBbc,{ paddingTop:5}]}>
            <Text style={[MstText,styles.T5,styles.bold]}>🔍 搜索</Text>
            <TextInput defaultValue={''} style={[styles.MeInputs,styles.T5,MstText]}/>
        </View>:<FlatList
            data={list}
            renderItem={()=><View style={styles.ListRow}>
                <Portrait w={38} h={38} r={30} t={'😢'}/>
                <View style={[styles.ListLi]} >
                    <Text style={[styles.T4,C2,styles.bold]}>朋友 </Text>
                    <Text style={[styles.T5,C2,styles.bold,{opacity:0.6}]}>🆔 100023</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    console.log('打招呼')
                }}>
                    <Text style={[styles.T2,C2,styles.bold,{marginRight:20}]}>👋</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    console.log('拒绝')
                }}>
                    <Text style={[styles.T2,C2,styles.bold,{marginRight:20}]}> 👎</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    console.log('同意')
                }}>
                    <Text style={[styles.T2,C2,styles.bold,{marginRight:20}]}>🤝</Text>
                </TouchableOpacity>


            </View>}
        />}
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
    {key:9},
    {key:10},
    {key:11},
    {key:12},
    {key:13},
    {key:14},
    {key:15}
]