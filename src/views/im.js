import {
    Alert, AppState,
    FlatList,
    Modal, Platform,
    SafeAreaView,
    Text,
    TextInput, TouchableHighlight, TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import {BbC, bColor, fColor, lightNsgBcB, MsgColor, MsgColorTouchable, MstText, styles} from "../css";
import {io} from "socket.io-client";
import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useEffect, useRef, useState} from "react";
import {
    _addStore,
    _Column,
    _DelIm,
    _ImTime,
    _Listen,
    _ListId,
    _ListNull,
    _Msg, _OnColumn, _OnListen,
    _Unread, _User,
    wss
} from "../utils/Api";
import {MsgImg, OssImage} from "../utils/oss";
import {memberBoolean, timeIm} from "../utils/time";
import * as Haptics from "expo-haptics";
import {Record} from "../utils/record";
import {Audio} from 'expo-av';
import {Portrait} from "../components/Portrait";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {Asset} from "expo-asset";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

const socket = io(wss)

export function Im({route, navigation}) {
    const schemes = useColorScheme();
    // 路由参数
    const {list} = route.params;

    const [user, setUser] = useState({}) //用户信息
    const userRef = useRef(user)
    userRef.current = user

    const [to, setTo] = useState([])     //收信人
    const [word, setWord] = useState([])     //词典
    const _interval = useRef()  //计时器
    const window = useWindowDimensions();

    const [page, setPage] = useState(0)      //页码
    const [refresh, setRefresh] = useState(false) //加载更新
    const [msgArr, setMsgArr] = useState([])        //对话列表
    const msgRef = useRef(msgArr)
    msgRef.current = msgArr

    const [imTitle, setImTitle] = useState('')   //对话标题
    const imTitleRef = useRef(imTitle)
    imTitleRef.current = imTitle
    const [isConnected, setIsConnected] = useState(true)  //离线状态
    const isConnectedRef = useRef(isConnected)
    isConnectedRef.current = isConnected

    const _ref = useRef(null)           //ScrollView 控制器

    const [columnLi, setColumnLi] = useState([]) //词列
    const columnRef = useRef(columnLi)
    columnRef.current = columnLi

    const [input, setInput] = useState('')  //输入信息
    const [audioLoad, setAudioLoad] = useState()  //录制声音
    const [seconds, setSeconds] = useState(1)   //计时时长
    const [onIm, setOnIm] = useState(NaN)     //选中项目
    const onImRef = useRef(onIm)
    onImRef.current = onIm

    //播放声音
    const [sound, setSound] = useState();
    const playSound = async (url) => {
        const {sound} = await Audio.Sound.createAsync({uri: url});
        setSound(sound);
        await sound.playAsync();
    }

    //点击播放
    const soundFun = async (i, im) => {
        setOnIm(i)
        if (im.url == 'null') {
            _Listen(im._id, im.enQ).then(async cb => {
                let arr = msgRef.current
                arr[i].url = cb.url
                setMsgArr(arr)
                console.log('无资源', cb.url)
                await playSound(cb.url)
            })
        } else {
            await playSound(im.url)
            console.log('有资源跟读', im.url)
        }
    }

    //消息撤回
    const recallFun = (im) => {
        let imObj = {
            "q": im,
            "list": list,
            "tIm": 5
        }
        socket.emit('im', imObj)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        console.log('撤回消息', imObj)
    }

    //解锁提示
    const alertHint = (t) => {
        let title = t == 1 ? '解锁词列' : '解锁跟读'
        let msg = t == 1 ? '提高词汇与语法能力' : '加强听力与口语'
        Alert.alert(title, msg, [
            {
                text: '激活码',
                onPress: () => navigation.navigate('ticket')
            },
            {
                text: '取消'
            }
        ])
    }

    useFocusEffect(
        useCallback(() => {
            //没有网络同步离线消息
            NetInfo.fetch().then(async state => {
                setIsConnected(state.isConnected)
                if (state.isConnected) {
                    _User().then(user => {
                        setUser(user)       //用户信息
                        //服务到期自动关停
                        if (!memberBoolean(user.member)) {
                            _OnColumn(false).then(user => setUser(user))
                            _OnListen(false).then(user => setUser(user))
                        }
                        // 接收会话信息
                        socket.on(list, async (im) => {
                            let arr = msgRef.current
                            if (im.tIm == 5) {
                                arr.map((item, index) => {
                                    if (im.q == item._id) {
                                        arr.splice(index, 1)
                                    }
                                })
                                setMsgArr([...arr])
                                return
                            }

                            arr.push(im)
                            setMsgArr([...arr])
                            setTimeout(() => _ref.current.scrollToEnd({animated: true}), im.tIm == 2 ? 500 : 100)
                            //跟读信号
                            // console.log('跟读', im)
                            if (memberBoolean(user.member) && im.url != 'null') {
                                setOnIm(arr.length - 1)
                                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                                await playSound(im.url)
                            }
                        });

                        //信道信息
                        _ListId(list).then(cb => {
                            // console.log('信道', cb)
                            if (cb.imTitle) {
                                setImTitle(cb.imTitle + `(${cb.userArr.length})`)
                                navigation.setOptions({
                                    title: cb.imTitle + `(${cb.userArr.length})`,
                                    headerRight: () => <Text style={[styles.T5, MstText(schemes), styles.bold,]}
                                                             onPress={() => navigation.navigate('adds', {'list': list})}
                                    >管理</Text>
                                })
                                let arr = []
                                cb.userArr.map(item => arr.push(item._id))
                                setTo(arr)      //群发对象
                            } else {
                                if (cb.userArr[0]._id == user._id) {
                                    setImTitle(cb.userArr[1].name)
                                    navigation.setOptions({title: cb.userArr[1].name})
                                    setTo([cb.userArr[1]._id])
                                } else {
                                    setImTitle(cb.userArr[0].name)
                                    navigation.setOptions({title: cb.userArr[0].name})
                                    setTo([cb.userArr[0]._id])
                                }
                            }
                        })

                        // 加载对话内容
                        _Msg(list, page).then(cd => {
                            console.log('滚动对话、、', cd.length)
                            setMsgArr(cd.reverse())
                            cd.length ? setTimeout(() => _ref.current.scrollToEnd({animated: true}), 200) : ''
                        })
                    })
                } else {
                    let user = await AsyncStorage.getItem('user')
                    setUser(JSON.parse(user))
                    let imString = await AsyncStorage.getItem(list)
                    let im = JSON.parse(imString)
                    setMsgArr(im.msgArr)
                    navigation.setOptions({title: im.title})
                }
            });

            return async () => {
                console.log('断开IM', list)
                if (isConnectedRef.current) {    //同步离线消息
                    await _Unread(list, userRef.current._id) //清除未读
                    await _ImTime(list) // 更新时间戳
                    socket.off(list)// 断开链接
                    let storage = {
                        title: imTitleRef.current,
                        msgArr: msgRef.current
                    }
                    console.log('同步Im离线消息', list)
                    await AsyncStorage.setItem(list, JSON.stringify(storage))
                }
            }
        }, [])
    )

    //更新播放器
    useEffect(() => {
        return sound
            ? () => {
                console.log('播放完毕');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])


    return (
        <View style={[styles.Im, bColor(schemes)]}>
            {/*录音推送*/}
            {audioLoad ?
                <View style={[styles.audioModel, {height: input.length ? window.height : window.height - 300}]}>
                    <View style={[styles.audioBody]}>
                        <Text style={[styles.T1, {fontWeight: '600', color: "#fff"}]}>{seconds} "</Text>
                        <Text style={[styles.T5, styles.bold, styles.Send, {
                            marginTop: 5,
                            color: "#fff"
                        }]}>松手即可发送</Text>
                    </View>
                </View> : ''}

            {/*词典*/}
            <Modal
                visible={Boolean(word.length)}
                onRequestClose={() => setWord([])}
                transparent={true}
                presentationStyle={'overFullScreen'}
                animationType="slide">
                <View style={[styles.Word]}>
                    <Text style={[styles.T4, styles.WordBtn]} onPress={() => setWord([])}>❌</Text>
                    <View style={[styles.Words, bColor(schemes)]}>
                        {word.map((item, index) => <TouchableOpacity key={'wodr' + index}>
                            <Text style={[styles.T5, styles.bold, {
                                marginTop: 5,
                                marginBottom: 10
                            }, MstText(schemes)]}>{item.key} </Text>
                            {item.value.map((items, i) => <View key={'wodrs' + i}>
                                <Text style={[styles.T5, MstText(schemes), {
                                    marginBottom: 10,
                                    opacity: 0.8
                                }]}>{items} </Text>
                            </View>)}
                            <View style={[BbC(schemes), styles.listBbC]}></View>
                        </TouchableOpacity>)}
                    </View>
                </View>
            </Modal>

            {/*对话内容*/}
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref={_ref}
                    refreshing={refresh}
                    onRefresh={() => {
                        let arr = msgRef.current
                        console.log('下拉刷新', page)
                        _Msg(list, page + 1).then(async cd => {
                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                            if (cd.length) {
                                setPage(page + 1)
                                setMsgArr(cd.concat(arr))
                                setTimeout(() => {
                                    _ref.current.scrollToIndex({animated: false, index: cd.length})
                                    setRefresh(false)
                                }, 360)
                            } else {
                                setRefresh(false)
                            }
                        })
                    }}
                    data={msgArr}
                    renderItem={({item, index}) => item.user._id == user._id ?
                        // 自己发送
                        <View key={'msg' + index}>
                            <RightMsg i={index}
                                      onIm={onIm}   //选中im
                                      onSound={(i, im) => soundFun(i, im)}     //播放译文
                                      omWord={(cd) => setWord(cd)}        //点击词典
                                      onHint={() => alertHint(2)}//提示充值
                                      onRecall={(im) => recallFun(im)}   //撤回消息
                                      user={user}       //用户信息
                                      data={item}/>
                        </View> :
                        // 别人的
                        <View style={styles.ImMsg} key={'msg' + index}>
                            {item.tIm != 4 ?
                                <Portrait w={32} h={32} r={7} t={item.user.emoji} url={item.user.avatar}/> : ''}
                            <LeftMsg i={index}
                                     onIm={onIm}   //被选中im
                                     omWord={(cd) => setWord(cd)}        //点击词典
                                     onRecall={(im) => recallFun(im)}   //撤回消息
                                     onSound={(i, im) => soundFun(i, im)}  //播放声音
                                     onHint={() => alertHint(2)}      //提示充值
                                     user={user}       //用户信息
                                     data={item}/>
                        </View>}
                    keyExtractor={item => item._id}
                    ListFooterComponent={() => Platform.OS == 'android' ? <View style={{height: 70}}></View> :
                        <View style={{height: 40}}></View>}
                />
            </SafeAreaView>

            <View style={[styles.imSend]}>


                <View style={styles.imFun}>
                    <TouchableOpacity style={user.column ? '' : {opacity: 0.3}}
                                      onPress={() => memberBoolean(user.member) ? _OnColumn(!userRef.current.column).then(cb => {
                                          setUser(cb)
                                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                      }) : alertHint(1)}>
                        <Text style={{fontSize: 17, marginLeft: 5}}> ✍️ </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={user.listen ? '' : {opacity: 0.3}}
                                      onPress={() => memberBoolean(user.member) ? _OnListen(!userRef.current.listen).then(cb => {
                                          setUser(cb)
                                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                      }) : alertHint(2)}>
                        <Text style={{fontSize: 17, marginLeft: 5}}> 🎧️ </Text>
                    </TouchableOpacity>

                </View>

                {/*词列*/}
                <View style={styles.imWord}>
                    {columnLi.map((item, index) =>
                        <Text key={'iw' + index} style={styles.imWords}> {item} </Text>
                    )}
                </View>

                {/*发送消息*/}
                <View style={[styles.imInput, bColor(schemes), {paddingLeft: 10, paddingRight: 10}]}>
                    {/*选择图片发送*/}
                    <OssImage userID={user._id} cb={(url) => {
                        let imData = {
                            "user": user._id,
                            "list": list,
                            "to": to,
                            "url": url,
                            "tIm": 2
                        }
                        socket.emit('im', imData)
                    }}/>
                    <TextInput value={input}
                               multiline={true}
                               style={[styles.imInputSend, styles.T5, MsgColor(schemes), MstText(schemes)]}
                               onFocus={({nativeEvent: {target}}) => setTimeout(() => {
                                   _ref.current.scrollToEnd({animated: true})
                               }, 100)}   //调整位置
                               onTextInput={({nativeEvent: {text, previousText, range: {start, end}}}) => {
                                   if (Platform.OS == 'ios') {
                                       // console.log('ios词列', text)
                                       let reg = /[^\u0000-\u00FF]/
                                       if (reg.test(text.trim()) && user.column) {
                                           _Column(text).then(cb => {
                                               let columnArr = columnRef.current  //词列
                                               columnArr.push(cb)
                                               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                               setColumnLi([...columnArr])
                                           })
                                       }
                                   }
                                   //重制词列
                                   if (start == 0) {
                                       console.log('重置词列')
                                       setColumnLi([...[]])
                                   }
                                   return
                               }}
                               onChangeText={text => {
                                   if (Platform.OS == 'android') {
                                       let str = text.substr(-(text.length - input.length))
                                       console.log('android词列', str)
                                       let regA = /[^\u0000-\u00FF]/
                                       if (regA.test(str.trim()) && user.column) {
                                           _Column(str).then(cb => {
                                               let columnArr = columnRef.current  //词列
                                               columnArr.push(cb)
                                               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                               setColumnLi([...columnArr])
                                           })
                                       }
                                   }
                                   setInput(text)
                               }}/>
                    {input.length ? <TouchableOpacity onPress={() => {
                        setInput('')
                        let imData = {
                            "user": user._id,
                            "list": list,
                            "to": to,
                            "listen": user.listen ? true : false,
                            "q": input,
                            "tIm": 1
                        }
                        socket.emit('im', imData)
                    }}>
                        <Text style={styles.imSendBtn}>发送</Text>
                    </TouchableOpacity> : <Record userID={user._id} start={() => {
                        // 开始录音
                        setAudioLoad(true)
                        _interval.current = setInterval(() => {
                            setSeconds(seconds => seconds + 1);
                        }, 1000);
                    }} stop={(ell) => {
                        // 停止录音
                        setAudioLoad(false)
                        setSeconds(1)
                        clearInterval(_interval.current)
                    }} cb={(url) => {
                        let imData = {
                            "user": user._id,
                            "list": list,
                            "to": to,
                            "url": url,
                            "q": seconds,
                            "tIm": 3
                        }
                        socket.emit('im', imData)
                    }}/>
                    }

                </View>
            </View>

        </View>
    )
}

async function downloadImg(url) {
    if (Platform.OS == 'android') {
        ImagePicker.requestMediaLibraryPermissionsAsync().then(async res => {
            if (res.canAskAgain) {
                let img = await Asset.fromModule(url)
                let {localUri} = await img.downloadAsync()
                const bent = await MediaLibrary.saveToLibraryAsync(localUri)
                Alert.alert('保存成功')
                console.log('保存图片到相册', bent)
            } else {
                Alert.alert('不被你允许')
            }
        })
    } else {
        let img = await Asset.fromModule(url)
        let {localUri} = await img.downloadAsync()
        const bent = await MediaLibrary.saveToLibraryAsync(localUri)
        Alert.alert('保存成功')
        console.log('保存图片到相册', bent)
    }
}

// 左边信息
function LeftMsg(props) {
    const {onIm, onSound, data, i, omWord, user, onHint} = props
    const schemes = useColorScheme();
    const window = useWindowDimensions();
    const [show, setShow] = useState(false) //操作键

    switch (data.tIm) {
        case 1:
            return <View style={[styles.msgRow]}>
                <View style={[{flexDirection: "row", alignItems: "center"}]}>
                    <TouchableOpacity style={[styles.msgText, {maxWidth: (0.6 * window.width)}, MsgColor(schemes)]}
                                      onPress={() => memberBoolean(user.member) ? onSound(i, data) : onHint()}
                                      onLongPress={() => {
                                          setShow(true)
                                          setTimeout(() => {
                                              setShow(false)
                                          }, 3000)
                                      }}>
                        <Text style={[styles.T5, MstText(schemes), styles.en, {opacity: 0.8}]}>{data.q}</Text>
                        <Text style={[styles.T6, MstText(schemes), styles.en, {opacity: 0.8}]}>{data.enQ}</Text>
                    </TouchableOpacity>
                    {i == onIm ? <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable(schemes)}>
                        <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>
                    </TouchableHighlight> : ''}
                </View>
                {show ? <View style={[styles.flot, MsgColor(schemes)]}>

                    {data.word.length ? <TouchableOpacity onPress={() => omWord(data.word)}>
                        <Text style={[MstText(schemes), styles.flotText]}> 词典 </Text>
                    </TouchableOpacity> : ''}
                    {data.word.length ? <View style={[styles.flotHx, lightNsgBcB(schemes)]}></View> : ''}

                    <TouchableOpacity onPress={() => {
                        _addStore({
                            url: data.url,
                            tIm: 1,
                            word: data.word,
                            user: data.user._id,
                            q: data.q,
                            enQ: data.enQ
                        }).then(cb => setShow(false))

                    }}>
                        <Text style={[styles.flotText, MstText(schemes)]}>收藏 </Text>
                    </TouchableOpacity>
                    <View style={[styles.flotHx, lightNsgBcB(schemes)]}></View>
                    <TouchableOpacity onPress={async () => {
                        await Clipboard.setStringAsync(data.enQ)
                        setShow(false)
                    }}>
                        <Text style={[styles.flotText, MstText(schemes)]}>复制译文</Text>
                    </TouchableOpacity>
                </View> : ''}
            </View>
            break;
        case 2:
            return <TouchableHighlight
                style={[styles.msgRow]}
                onPress={() => Alert.alert('操作图片', '将图片下载到本地', [
                    {
                        text: "下载",
                        onPress: async () => downloadImg(data.url)
                    },
                    {
                        text: "取消"
                    }
                ])}
            >
                <MsgImg url={data.url}/>
            </TouchableHighlight>
            break;
        case 3:
            return <View style={[styles.msgRow, {flexDirection: "row", alignItems: "center"}]}>
                <TouchableOpacity
                    style={[styles.msgText, {width: data.q < 20 ? 20 + (data.q * 10) : 100}, MsgColor(schemes)]}
                    onPress={() => onSound(i, data)}>
                    <Text style={[styles.T5, MstText(schemes), styles.en, {opacity: 0.8}]}>{data.q} "</Text>
                </TouchableOpacity>
                {i == onIm ? <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text> : ''}
            </View>
            break;
        case 4:
            return <Text
                style={[styles.time, MstText(schemes), {width: window.width, opacity: 0.3}]}>{timeIm(data.q)}</Text>
            break
    }
}

// 右边信息
function RightMsg(props) {
    const {onIm, data, i, onSound, omWord, onRecall, user, onHint} = props
    const schemes = useColorScheme();
    const window = useWindowDimensions();
    const [show, setShow] = useState(false)

    switch (data.tIm) {
        case 1:
            return <View style={[styles.msgRowRight]}>
                <View style={[{flexDirection: "row", alignItems: "center"}]}>
                    {i == onIm ? <TouchableHighlight>
                        <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>
                    </TouchableHighlight> : ''}
                    <TouchableOpacity
                        style={[styles.msgText, {backgroundColor: '#5A8DFF', maxWidth: (0.6 * window.width)}]}
                        onPress={() => memberBoolean(user.member) ? onSound(i, data) : onHint(i, data)}
                        onLongPress={() => {
                            setShow(true)
                            setTimeout(() => {
                                setShow(false)
                            }, 3000)
                        }}>
                        <Text style={[styles.T5, {color: "#fff"}]}>{data.q}</Text>
                        <Text style={[styles.T6, styles.en, {color: "#fff"}, {opacity: 0.8}]}>{data.enQ}</Text>
                    </TouchableOpacity>
                </View>
                {show ? <View style={[styles.flot, {backgroundColor: '#5A8DFF'}]}>
                    {data.word.length ? <TouchableOpacity onPress={() => omWord(data.word)}>
                        <Text style={[{color: "#fff"}, styles.flotText]}> 词典 </Text>
                    </TouchableOpacity> : ''}
                    {data.word.length ? <View style={[styles.flotHx, {backgroundColor: '#EAEAEA'}]}></View> : ""}
                    <TouchableOpacity onPress={() => {
                        _addStore({
                            url: data.url,
                            tIm: 1,
                            word: data.word,
                            user: data.user._id,
                            q: data.q,
                            enQ: data.enQ
                        }).then(r => setShow(false))
                    }}>
                        <Text style={[{color: "#fff"}, styles.flotText]}> 收藏 </Text>
                    </TouchableOpacity>

                    <View style={[styles.flotHx, {backgroundColor: '#EAEAEA'}]}></View>
                    <TouchableOpacity onPress={async () => {
                        await Clipboard.setStringAsync(data.enQ)
                        setShow(false)
                    }}>
                        <Text style={[{color: "#fff"}, styles.flotText]}> 复制译文</Text>
                    </TouchableOpacity>

                    <View style={[styles.flotHx, {backgroundColor: '#EAEAEA'}]}></View>
                    <TouchableOpacity onPress={() => Alert.alert('撤回消息', '一旦撤回将永不可见', [
                        {
                            text: '确定',
                            onPress: () => onRecall(data._id)
                        },
                        {
                            text: '取消',
                            onPress: () => setShow(false)
                        }
                    ])}>
                        <Text style={[{color: "#fff"}, styles.flotText]}> 撤回 </Text>
                    </TouchableOpacity>

                </View> : ''}
            </View>
            break;
        case 2:
            return <View style={[styles.msgRowRight]}>
                <TouchableHighlight
                    onPress={() => Alert.alert('操作图片', '可以撤回图片，或下载到相册', [
                        {
                            text: '撤回',
                            onPress: () => onRecall(data._id)
                        },
                        {
                            text: "下载",
                            onPress: async () => downloadImg(data.url)
                        },
                        {
                            text: "取消"
                        }
                    ])}>
                    <MsgImg url={data.url}/>
                </TouchableHighlight>
            </View>
            break;
        case 3:
            return <View style={[styles.msgRowRight, {flexDirection: "row", alignItems: "center"}]}>
                {i == onIm ? <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text> : ''}

                <TouchableOpacity style={[styles.msgText, {
                    backgroundColor: '#5A8DFF',
                    width: data.q < 20 ? 20 + (data.q * 10) : 100
                }]}
                                  onPress={() => onSound(i, data)}
                                  onLongPress={() => Alert.alert('撤回语音', '消息撤回后，将不可见', [
                                      {
                                          text: "确定",
                                          onPress: () => onRecall(data._id)
                                      },
                                      {
                                          text: "取消"
                                      }
                                  ])}>
                    <Text style={[styles.T5, styles.en, {
                        color: "#fff",
                        opacity: 0.8,
                        width: data.q < 20 ? 20 + (data.q * 10) : 100
                    }]}> {data.q} "</Text>
                </TouchableOpacity>
            </View>
            break;
        case 4:
            return <Text
                style={[styles.time, MstText(schemes), {width: window.width, opacity: 0.3}]}>{timeIm(data.q)}</Text>
            break
    }
}


