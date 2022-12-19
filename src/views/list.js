import {
    AccessibilityInfo,
    ActivityIndicator, AppState,
    Button,
    FlatList,
    Image,
    Platform, Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import {Component, useEffect, useRef, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Btn, DCBtn} from "../component/btn";
import {Portrait, Portraits} from "../component/portrait";
import {_emoji, _List, _User, ip} from "../_Api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from "@react-navigation/native";
import {io} from "socket.io-client";
import {timeIm} from "../utils/time";
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const socket = io(`ws://${ip}:3000`)

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();
    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

export function List({navigation}) {

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC

    const [load, setLoad] = useState(false)
    const [list, setList] = useState(Array)      //联系人列表
    const listRef = useRef(list)
    listRef.current = list

    const [emoji, setEmoji] = useState(false)      //设置表情
    const [login,setLogin] =useState(false)      //登陆提示


    const [user, setUser] = useState({}) //用户信息
    const [page,setPage] = useState(0)      //页码

    //推送标题
    const nfTitle = (li)=>{
        console.log('推送',li.imType)
        if(li.imType == '2'){
            return li.imTitle
        }
        if(user.id == li.userArr[0].id){
            return li.userArr[1].name
        }else{
            return li.userArr[0].name
        }
    }

    //进程监听
    useEffect( () => {
        AppState.addEventListener("change", (handler) => {
            console.log('状态', handler)
            if(handler == 'background'){
                return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
                    minimumInterval: 1 * 60, // task will fire 1 minute after app is backgrounded
                });
            }

        });
    },[])
    useFocusEffect(
        React.useCallback(() => {

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });

            //token登陆鉴权
            AsyncStorage.getItem('tokenIn').then(async tokenIn => {
                let time = Date.parse(new Date()) / 1000
                if (time < tokenIn) {
                    setLogin(true)
                    //用户信息
                    await _User(cb => {
                        // console.log('用户信道:', cb._id)
                        setUser(cb)
                        // <Btn text={'📬 '} fs={18} press={() => navigation.navigate('Add')}/>
                        // 设置导航头
                        navigation.setOptions({
                            headerLeft: () => <TouchableOpacity style={styles.listTitle} onPress={()=>navigation.navigate('Add')}>
                                <Text style={styles.listTitleT1}>📬</Text>
                                <Text style={styles.listTitleT2}>3</Text>
                            </TouchableOpacity>,
                            headerRight: () => <Pressable onPress={() => navigation.navigate('Me')}
                                                          onLongPress={() => setEmoji(true)}>
                                <Text style={{fontSize: 23}}>{cb.emoji}</Text>
                            </Pressable>,
                        })
                        //联系人列表
                        _List(cb => {
                            setList([...cb])
                        })

                        // 接收信息
                        socket.on(cb._id, async li => {
                            const settings = await Notifications.getPermissionsAsync();
                            console.log('通知权限',settings)

                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: nfTitle(li),
                                    body: li.text,
                                },
                                trigger: null,
                            });

                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                            let arr = listRef.current
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


    const emojiArr = ["😀", "😁", "😂", "🤣", "😃", "😅", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "🙂", "🤗", "🤔", "😐",
        "😶", "🙄", "😏", "😣", "😥", "🤐", "😪", "😫", "😴", "😌", "😛", "😜", "🤤", "😒", "😔", "😕", "🤑", "😢", "😭"]

    if(login){
        return <View style={[styles.List, C1]}>
            {/*选择表情包*/}
            {emoji ? <View style={styles.yan}>
                <FlatList
                    data={emojiArr}
                    horizontal={true}
                    renderItem={({item, i}) => <TouchableOpacity
                        onPress={() => {
                            _emoji(item, cb => {
                                navigation.setOptions({
                                    headerRight: () => <Pressable onPress={() => navigation.navigate('Me')}
                                                                  onLongPress={() => setEmoji(true)}>
                                        <Text style={{fontSize: 23}}>{item}</Text>
                                    </Pressable>,
                                })
                                setEmoji(false)
                            })
                        }}>
                        <Text style={{fontSize: 26, marginRight: 5}}>{item}</Text>
                    </TouchableOpacity>}
                />
            </View> : ''}

            {/*联系人列表*/}
            {list ? <FlatList data={list}
                              ItemSeparatorComponent={() => <View style={[BbC, styles.listBbC]}></View>}
                              refreshing={load}
                              onRefresh={() => {
                                  setLoad(true)
                                  _List(cb => {
                                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                                      setLoad(false)
                                      setList([...cb])
                                  })
                              }}
                              renderItem={({item}) =>
                                  <TouchableOpacity style={[styles.ListRow]}
                                                    onPress={() => navigation.navigate('Im', {list: item._id})}>
                                      {item.imType == '2'?
                                          <Portraits imgArr={item.userArr}  unread={unreadFun(item.unread, user._id)} />
                                          :<Portrait w={38} h={38} r={3}
                                                     t={user.id == item.userArr[0].id ? item.userArr[1].emoji : item.userArr[0].emoji}
                                                     url={user.id == item.userArr[0].id ? item.userArr[1].avatar : item.userArr[0].avatar}
                                                     unread={unreadFun(item.unread, user._id)}/>}
                                      <View style={[styles.ListLi]}>
                                          {item.imType == '2'?
                                              <Text style={[styles.T4, C2, styles.bold]}>{item.imTitle}</Text>:
                                              <Text style={[styles.T4, C2, styles.bold]}>{user.id == item.userArr[0].id ? item.userArr[1].name : item.userArr[0].name}</Text>
                                          }
                                          <Text style={[styles.T5, C2, styles.bold, {opacity: 0.6}]} numberOfLines={1}>{item.text}</Text>
                                      </View>
                                      <Text style={[styles.T6, C2, styles.bold, {
                                          marginRight: 10,
                                          opacity: 0.3
                                      }]}>{timeIm(item.updatedAt)}</Text>
                                  </TouchableOpacity>}/> : <Text>什么都么有</Text>}
        </View>
    }else {
        return  <View style={[C1,styles.listLogin]}>
            <Image style={styles.listLoginImg} />
            <Text style={styles.listBtn} onPress={()=> navigation.navigate('Login')}> 登陆使用 </Text>
        </View>
    }

}



