import {
    Button,
    FlatList,
    Image,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import {Component, useEffect, useRef, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Btn} from "../component/btn";
import {Portrait} from "../component/Portrait";


export function List({navigation}){

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC

    const [load,setLoad] = useState(false)

    const Add = ()=>{
        navigation.navigate('Add')
    }

    const Me = ()=>{
        navigation.navigate('Me')
    }

    useEffect(()=>{
        navigation.setOptions({
            title:"小船im",
            headerLeft: () => <Btn text={'📬'} fs={18} press={()=>navigation.navigate('Add')} />,
            headerRight: () => <Btn text={'😯'} fs={20} press={()=>navigation.navigate('Me')} />,
        })

        return ()=>{
            console.log('卸载信道')
        }
    },[])

    return <View style={[styles.List,C1]}>
        <FlatList data={list}
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
                  </TouchableOpacity>}/>


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

