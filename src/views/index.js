//首页联系人
import {
    Alert,
    AppState,
    Button,
    FlatList,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import {bColor, fColor, MstText, styles} from "../css";
import {pushNotifications} from "../utils/useNotifications";
import {_DelIm, _Emoji, _List, _ListNull, _User, wss} from "../utils/Api";
import {useCallback, useEffect, useRef, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {timeIm} from "../utils/time";
import {Portrait, Portraits} from "../components/Portrait";
import * as Haptics from 'expo-haptics';
import {io} from "socket.io-client";
import NetInfo from "@react-native-community/netinfo";
import navigation from "../utils/rootNavigation";

const socket = io(wss)

export function Index({navigation}) {
    const schemes = useColorScheme();
    const [graphic, setGraphic] = useState('获取验证码')
    const [login, setLogin] = useState(true)     //登陆状态
    const [list, setList] = useState(Array)      //联系人列表
    const listRef = useRef(list)
    listRef.current = list

    const [emoji, setEmoji] = useState(false)      //设置表情
    const [user, setUser] = useState({}) //用户信息
    const userRef = useRef(user)
    userRef.current = user

    const [page, setPage] = useState(0)      //页码

    const [refresh, setRefresh] = useState(false) //加载更新
    const [isConnected, setIsConnected] = useState(true)
    const isConnectedRef = useRef(isConnected)
    isConnectedRef.current = isConnected

    const [handler, setHandler] = useState('active')   //前后台
    const handlerRef = useRef(handler)
    handlerRef.current = handler

    //前后台监听
    useEffect(() => {
        AppState.addEventListener("change", async (handler) => {
            setHandler(handler)
        })
    }, [])

    // 路由生命周期
    useFocusEffect(
        useCallback(() => {
            //没有网络同步离线消息
            NetInfo.fetch().then(async state => {
                setIsConnected(state.isConnected)
                if (state.isConnected) {
                    // 加载基本信息
                    AsyncStorage.getItem('tokenIn').then(async tokenIn => {
                        let time = Date.parse(new Date()) / 1000
                        if (time < tokenIn) {
                            setLogin(true)
                            _User().then(user => {
                                setUser(user)
                                navigation.setOptions({
                                    headerRight: () => <Pressable onPress={() => navigation.navigate('me')}
                                                                  onLongPress={() => setEmoji(true)}>
                                        <Text style={{fontSize: 23}}>{user.emoji}</Text>
                                    </Pressable>,
                                })

                                // 接收信息
                                socket.on(user._id, async li => {
                                    // 切换到后台监听信息
                                    console.log('li', handlerRef.current)
                                    if (handlerRef.current == 'background') {
                                        await pushNotifications(li.imType == 1 ? li.user.name : li.imTitle, li.text, li._id)
                                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)//震动手机
                                        navigation.navigate('index')
                                    }
                                    //震动手机
                                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
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

                            // 联系人列表
                            setTimeout(async () => {
                                setList(await _List())
                            }, 100)

                            //获取非好友信道
                            _ListNull().then(cb => {
                                let lists = cb.length
                                // console.log('获取非好友信道', cb.length)
                                navigation.setOptions({
                                    headerLeft: () => <TouchableOpacity style={styles.listTitle}
                                                                        onPress={() => navigation.navigate('add')}>
                                        <Text style={styles.listTitleT1}>📬</Text>
                                        {lists ? <Text style={styles.listTitleT2}>{lists}</Text> : ''}
                                    </TouchableOpacity>
                                })
                            })
                        } else {
                            setLogin(false)
                        }
                    })
                }else {
                    let listString = await AsyncStorage.getItem('list')
                    let list = JSON.parse(listString)
                    console.log(list)
                    setList([...list])
                    setUser({})
                }
            });

            return async () => {
                console.log('退出联系人', userRef.current._id, listRef.current.length)
                if(isConnectedRef.current){
                    //同步离线消息
                    if (isConnectedRef.current) {
                        await AsyncStorage.setItem('list', JSON.stringify(listRef.current))
                        await AsyncStorage.setItem('user', JSON.stringify(userRef.current))
                    }
                    socket.off(userRef.current._id)
                }

            };
        }, [])
    );

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


    if (login) {
        return <View style={[styles.List, bColor(schemes)]}>
            {/*<Button title={'清楚token'} onPress={async () => {*/}
            {/*    await AsyncStorage.removeItem('token')*/}
            {/*    await AsyncStorage.removeItem('tokenIn')*/}
            {/*}}/>*/}
            {/*选择表情包*/}
            {emoji ? <View style={styles.yan}>
                <FlatList
                    data={emojiArr}
                    horizontal={true}
                    renderItem={({item, i}) => <TouchableOpacity
                        onPress={() => {
                            _Emoji(item).then(item => {
                                navigation.setOptions({
                                    headerRight: () => <Pressable
                                        onPress={() => navigation.navigate('me')}
                                        onLongPress={() => setEmoji(true)}>
                                        <Text style={{fontSize: 23}}>{item.emoji}</Text>
                                    </Pressable>,
                                })
                                setEmoji(false)
                            })
                        }}>
                        <Text style={{fontSize: 26, marginRight: 5}}>{item}</Text>
                    </TouchableOpacity>}
                />
            </View> : ''}

            {/*网络中断提示*/}
            {isConnected ? '' : <View style={[styles.isConnected]}>
                <Text style={[styles.T5, styles.bold, {color: '#fff'}]}> 当前没有网络哟！！！</Text>
            </View>}

            {/*联系人列表*/}
            {list ? <FlatList data={list}
                              ItemSeparatorComponent={() => <View style={[bColor(schemes), styles.listBbC]}></View>}
                              refreshing={refresh}
                              onRefresh={() => {
                                  setRefresh(true)
                                  _List().then(async list => {
                                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)//震动手机
                                      setRefresh(false)
                                      setList([...list])
                                  })
                              }}
                              renderItem={({item}) => <TouchableOpacity
                                  style={[styles.ListRow]}
                                  onPress={() => navigation.navigate('im', {list: item._id})}
                                  onLongPress={() => item.imType == 1 ? Alert.alert('移除联系人', '移除后所有的消息，都将不可见', [
                                      {
                                          text: '确定',
                                          onPress: () => _DelIm(item._id, async cb => {
                                              setList([...await _List()])
                                          })
                                      },
                                      {
                                          text: '取消'
                                      }
                                  ]) : ''}
                              >
                                  {item.imType == '2' ?
                                      <Portraits imgArr={item.userArr} unread={unreadFun(item.unread, user._id)}/>
                                      : <Portrait w={38} h={38} r={3}
                                                  t={user.id == item.userArr[0].id ? item.userArr[1].emoji : item.userArr[0].emoji}
                                                  url={user.id == item.userArr[0].id ? item.userArr[1].avatar : item.userArr[0].avatar}
                                                  unread={unreadFun(item.unread, user._id)}/>}
                                  <View style={[styles.ListLi]}>
                                      {item.imType == '2' ?
                                          <Text
                                              style={[styles.T4, fColor(schemes), styles.bold]}>{item.imTitle}</Text> :
                                          <Text
                                              style={[styles.T4, fColor(schemes), styles.bold]}>{user.id == item.userArr[0].id ? item.userArr[1].name : item.userArr[0].name}</Text>
                                      }
                                      <Text style={[styles.T5, fColor(schemes), styles.bold, {opacity: 0.6}]}
                                            numberOfLines={1}>{item.text}</Text>
                                  </View>
                                  <Text style={[styles.T6, fColor(schemes), styles.bold, {
                                      marginRight: 10,
                                      opacity: 0.3
                                  }]}>{timeIm(item.updatedAt)}</Text>
                              </TouchableOpacity>}/> : <Text>什么都么有</Text>}
        </View>
    } else {
        return <View style={[styles.listLogin, bColor(schemes)]}>
            <Button title={'清楚token'} onPress={async () => {
                await AsyncStorage.removeItem('token')
                await AsyncStorage.removeItem('tokenIn')
            }}/>
            <Image style={styles.listLoginImg}/>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text style={styles.listBtn}> 登陆使用 </Text>
            </TouchableOpacity>
        </View>
    }

}
