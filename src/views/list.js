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
import {_List, _User} from "../_Api";

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from "@react-navigation/native";
import {io} from "socket.io-client";
import {timeIm} from "../utils/time";

const socket = io('ws://192.168.0.104:3000')

export function List({navigation}) {


    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC

    const [load, setLoad] = useState(false)
    const [list, setList] = useState(Array)      //联系人列表
    const listRef = useRef(list)
    listRef.current = list

    const [user, setUser] = useState({}) //用户信息

    useFocusEffect(
        React.useCallback(() => {
            //token登陆鉴权
            AsyncStorage.getItem('tokenIn').then(async tokenIn => {
                let time = Date.parse(new Date()) / 1000
                if (time < tokenIn) {


                    //用户信息
                    await _User(cb => {
                        console.log('用户信道:', cb._id)
                        setUser(cb)

                        //联系人列表
                        _List(cb => {
                            setList([...cb])
                        })

                        // 接收信息
                        socket.on(cb._id, li => {
                            let arr = listRef.current
                            console.log('信道长度:', arr.length)
                            arr.map((item, index) => {
                                if (item._id == li._id) {
                                    arr.splice(index, 1)
                                    arr.unshift(li)
                                }
                            })
                            setList([...arr])

                        })

                    })

                } else {
                    console.log('登陆过期，重新登陆')
                }
            })

            // 设置导航头
            navigation.setOptions({
                title: "小船im",
                headerLeft: () => <Btn text={'📬'} fs={18} press={() => navigation.navigate('Add')}/>,
                headerRight: () => <Btn text={'😯'} fs={20} press={() => navigation.navigate('Me')}/>,
            })

            return () => {
                socket.off(user._id)
                console.log('离开list,断开链接：' + user._id)
            }
        }, [])
    )

    //整理未读！
    const unreadFun = function (arr, id) {
        let arrNumber = []
        arr.map((item, index) => {
            if (item == id) {
                arrNumber.push(arr)
            }
        })
        if (arrNumber.length >= 99) {
            return '...';
        } else {
            return arrNumber.length;
        }

    };
    return <View style={[styles.List, C1]}>
        {list ? <FlatList data={list}
                          ItemSeparatorComponent={() => <View style={[BbC, styles.listBbC]}></View>}
                          refreshing={load}
                          onRefresh={async () => {
                              setLoad(true)
                              await _List(cb => {
                                  setList([...cb])
                                  setLoad(false)
                              })
                          }}
                          renderItem={({item}) =>
                              <TouchableOpacity style={[styles.ListRow]}
                                                onPress={() => navigation.navigate('Im', {
                                                    list: item._id,
                                                    unread: unreadFun(item.unread, user._id),
                                                    to: user.id == item.user.id ? item.userArr[1]._id : item.userArr[0]._id,
                                                    name: user.id == item.user.id ? item.userArr[1].name : item.userArr[0].name
                                                })}>
                                  <Portrait w={38} h={38} r={3} t={'😢'}
                                            url={user.id == item.user.id ? item.userArr[1].avatar : item.userArr[0].avatar}
                                            unread={unreadFun(item.unread, user._id)}/>
                                  <View style={[styles.ListLi]}>
                                      <Text
                                          style={[styles.T4, C2, styles.bold]}>{user.id == item.user.id ? item.userArr[1].name : item.userArr[0].name}</Text>
                                      <Text style={[styles.T5, C2, styles.bold, {opacity: 0.6}]}>{item.text}</Text>
                                  </View>
                                  <Text style={[styles.T6, C2, styles.bold, {
                                      marginRight: 10,
                                      opacity: 0.3
                                  }]}>{timeIm(item.updatedAt)}</Text>
                              </TouchableOpacity>}/> : <Text>什么都么有</Text>}


    </View>
}


