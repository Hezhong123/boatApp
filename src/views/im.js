import {
    ActivityIndicator, Alert,
    Button, FlatList,
    Image, Modal, Platform, Pressable, RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableHighlight, TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import {Component, useEffect, useRef, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Portrait} from "../component/portrait";
import {Btn, TextClick} from "../component/btn";
import {useFocusEffect} from "@react-navigation/native";
import {_addStore, _Column, _ImTime, _Listen, _ListId, _Msg, _onColumn, _onListen, _Unread, _User, ip} from "../_Api";
import {io} from "socket.io-client";
import {OssImage} from "../utils/oss";
import {Record} from "../component/record";
import {memberFun, timeIm} from "../utils/time";
import KeyboardAvoidingView from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";
import {Audio} from 'expo-av';

const socket = io(`ws://${ip}:3000`)
const host = `http://${ip}:3000/audio/`
import * as Clipboard from 'expo-clipboard'
import {msg} from "@babel/core/lib/config/validation/option-assertions";
import * as Haptics from "expo-haptics";

export function Im({route, navigation}) {
    const colorScheme = useColorScheme();
    // 路由参数
    const {list} = route.params;

    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色

    const [user, setUser] = useState({}) //用户信息
    const userRef = useRef(user)
    userRef.current = user

    const [member, setMember] = useState(false)  //会员到期

    const [input, setInput] = useState('')  //输入信息
    const [audioLoad, setAudioLoad] = useState()  //录制声音
    const [seconds, setSeconds] = useState(1)   //计时时长

    const [onIm, setOnIm] = useState(NaN)     //选中项目
    const onImRef = useRef(onIm)
    onImRef.current = onIm

    const [columnLi, setColumnLi] = useState([]) //词列
    const columnRef = useRef(columnLi)
    columnRef.current = columnLi

    const _ref = useRef(null)           //ScrollView 控制器

    const [msgArr, setMsgArr] = useState([])        //对话列表
    const msgRef = useRef(msgArr)
    msgRef.current = msgArr

    const [page, setPage] = useState(0)      //页码

    const [to, setTo] = useState([])     //收信人
    const [word, setWord] = useState([])     //词典
    const _interval = useRef()  //计时器
    const window = useWindowDimensions();

    //会员到期时间判定
    const memberBoolean = (t) => {
        let now = new Date();
        let time = new Date(t)
        if (time > now) {
            return true
        } else {
            return false
        }
    }

    // 路由生命周期
    useFocusEffect(React.useCallback(() => {
        //获取用户信息
        _User(user => {
            //获取信道信息
            setUser(user)
            console.log('userIM:',user)
            setMember(true)   //功能解锁
            _ListId(list, cb => {
                // console.log('信道内容',cb,user)
                if (cb.imTitle) {
                    navigation.setOptions({
                        title: cb.imTitle + `(${cb.userArr.length})`,
                        headerRight: () => <Text style={[styles.T5, MstText, styles.bold,]}
                                                 onPress={() => navigation.navigate('Adds', {'list': list})}
                        >管理</Text>
                    })
                    let arr = []
                    cb.userArr.map(item => arr.push(item._id))
                    setTo(arr)      //群发对象
                } else {
                    if (cb.userArr[0]._id == user._id) {
                        navigation.setOptions({title: cb.userArr[1].name})
                        setTo([cb.userArr[1]._id])
                    } else {
                        navigation.setOptions({title: cb.userArr[0].name})
                        setTo([cb.userArr[0]._id])
                    }
                }
            })

        })


        // 加载对话内容
        _Msg(list, page, cd => {
            console.log('滚动对话、、', cd.length)
            setMsgArr(cd)
            cd.length ? setTimeout(() => _ref.current.scrollToEnd({animated: true}), 200) : ''
        })

        // 接收信息
        socket.on(list, (im) => {
            let arr = msgRef.current
            //撤回消息同志
            if (im.tIm == 5) {
                arr.map((item, index) => {
                    if (im.q == item._id) {
                        console.log('撤回消息', index)
                        arr.splice(index, 1)
                    }
                })
                setMsgArr([...arr])
                return
            }

            arr.push(im)
            setMsgArr([...arr])
            setTimeout(() => _ref.current.scrollToEnd({animated: true}), 100)
            //跟读信号
            // console.log('跟读',im)
            if (userRef.current.listen && im.tIm == 1&& user._id== im.user._id) {
                playSound(arr.length - 1, im)
            }

            if(!userRef.current.listen){
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            }
        });


        return () => {
            _ImTime(list) // 更新时间戳
            socket.off(list)// 断开链接
            _Unread(list, userRef.current._id) //清除未读

        }
    }, []))

    //下啦刷新
    const [load, setLoad] = useState(false)


    //播放声音
    const [sound, setSound] = React.useState();
    const playSound = async (i, im) => {
        const audioFun = async (key, url) => {
            setOnIm(key)
            const {sound} = await Audio.Sound.createAsync({uri: url});
            setSound(sound);
            await sound.playAsync();
        }

        if (im.tIm == 1) {
            if (im.url == 'null') {
                _Listen(im._id, im.enQ, cb => {
                    console.log('本地跟读', cb.url)
                    let arr = msgRef.current
                    arr[i].url = cb.url
                    setMsgArr(arr)
                    audioFun(i, host + cb.url)
                })
            } else {
                console.log('云端跟读', im.url)
                audioFun(i, host + im.url)
            }
        }

        //播放语音
        if (im.tIm == 3) {
            audioFun(i, im.url)
        }
    }

    //解锁提示
    const alertMember = (t) => {
        let title = t == 1 ? '词列解锁' : '解锁跟读'
        let msg = t == 1 ? '提高词汇与语法能力' : '加强听力与口语'
        Alert.alert(title, msg, [
            {
                text: '充值',
                onPress: () => Alert.alert('充值解锁', '这个功能还在开发中、')
            },
            {
                text: '激活码',
                onPress: () => navigation.navigate('Ticket')
            },
            {
                text: '取消'
            }
        ])
    }

    //消息撤回
    const recallFun = (im) => {
        let imData = {
            "q": im,
            "list": list,
            "tIm": 5
        }
        socket.emit('im', imData)
        console.log('撤回消息', imData)
    }

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


    return <View style={[C1, styles.Im]}>
        {/*录音推送*/}
        {audioLoad ? <View style={[styles.audioModel, {height: input.length ? window.height : window.height - 300}]}>
            <View style={[styles.audioBody]}>
                <Text style={[styles.T1, {fontWeight: '600', color: "#fff"}]}>{seconds} "</Text>
                <Text style={[styles.T5, styles.bold, styles.Send, {marginTop: 5, color: "#fff"}]}>松手即可发送</Text>
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
                <View style={[styles.Words, C1]}>
                    {word.map((item, index) => <TouchableOpacity key={'wodr' + index}>
                        <Text style={[styles.T5, styles.bold, {
                            marginTop: 5,
                            marginBottom: 10
                        }, MstText]}>{item.key} </Text>
                        {item.value.map((items, i) => <View key={'wodrs' + i}>
                            <Text style={[styles.T5, MstText, {marginBottom: 10, opacity: 0.8}]}>{items} </Text>
                        </View>)}
                        <View style={[BbC, styles.listBbC]}></View>
                    </TouchableOpacity>)}
                </View>
            </View>
        </Modal>


        <SafeAreaView style={styles.container}>
            <FlatList
                ref={_ref}
                refreshing={load}
                onRefresh={()=>{
                    setLoad(true)
                    let arr = msgRef.current
                    console.log('下拉刷新', page)
                    _Msg(list, page + 1, cd => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                        setLoad(false)
                        if (cd.length) {
                            setPage(page + 1)
                            setMsgArr(cd.concat(arr))

                            setTimeout(()=>{
                            _ref.current.scrollToIndex({animated:false,index:cd.length,viewOffset:36})
                            },200)
                        }
                    })
                }}
                data={msgArr}
                renderItem={({item,index})=>item.user._id == user._id ?
                    // 自己发送
                    <View key={'msg' + index}>
                        <RightMsg i={index}
                                  onIm={onIm}   //选中im
                                  onSound={(i, im) => playSound(i, im)}     //播放译文
                                  omWord={(cd) => setWord(cd)}        //点击词典
                                  onRecall={(im) => recallFun(im)}   //撤回消息
                                  data={item}/>
                    </View> :
                    // 别人的
                    <View style={styles.ImMsg} key={'msg' + index}>
                        {item.tIm != 4 ? <Portrait w={32} h={32} r={7} t={item.user.emoji} url={item.user.avatar}/> : ''}
                        <LeftMsg i={index}
                                 onIm={onIm}   //被选中im
                                 omWord={(cd) => setWord(cd)}        //点击词典
                                 onRecall={(im) => recallFun(im)}   //撤回消息
                                 onSound={(i, im) => playSound(i, im)}
                                 data={item}/>
                    </View>}
                keyExtractor={item => item._id}
            />
        </SafeAreaView>

        {/*对话内容*/}
        {/*<ScrollView*/}
        {/*    style={styles.ims}*/}
        {/*    refreshing={true}*/}
        {/*    refreshControl={<RefreshControl refreshing={load} onRefresh={onRefresh}/>}*/}
        {/*    keyboardDismissMode={"on-drag"}*/}
        {/*    ref={_ref}>*/}
        {/*    {msgArr.map((item, index) => item.user._id == user._id ?*/}
        {/*        // 自己发送*/}
        {/*        <View key={'msg' + index}>*/}
        {/*            <RightMsg i={index}*/}
        {/*                      onIm={onIm}   //选中im*/}
        {/*                      onSound={(i, im) => playSound(i, im)}     //播放译文*/}
        {/*                      omWord={(cd) => setWord(cd)}        //点击词典*/}
        {/*                      onRecall={(im) => recallFun(im)}   //撤回消息*/}
        {/*                      data={item}/>*/}
        {/*        </View> :*/}
        {/*        // 别人的*/}
        {/*        <View style={styles.ImMsg} key={'msg' + index}>*/}
        {/*            {item.tIm != 4 ? <Portrait w={32} h={32} r={7} t={item.user.emoji} url={item.user.avatar}/> : ''}*/}
        {/*            <LeftMsg i={index}*/}
        {/*                     onIm={onIm}   //被选中im*/}
        {/*                     omWord={(cd) => setWord(cd)}        //点击词典*/}
        {/*                     onRecall={(im) => recallFun(im)}   //撤回消息*/}
        {/*                     onSound={(i, im) => playSound(i, im)}*/}
        {/*                     data={item}/>*/}
        {/*        </View>)}*/}
        {/*    <View style={{height: 70}}></View>*/}
        {/*</ScrollView>*/}


        {/*发送信息*/}
        <View style={[styles.imSend]}>
            {/*操作列表*/}
            <View style={styles.imFun}>
                <View style={user.column ? '' : {opacity: 0.3}}>
                    <Btn text={'✍️'} fs={16} press={() =>member?_onColumn(!userRef.current.column, user =>{
                        setUser(user)
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }) : alertMember('1')}/>
                </View>
                <View style={user.listen ? '' : {opacity: 0.3}}>
                    <Btn text={'🎧️️'} fs={16} press={() =>member?_onListen(!userRef.current.listen, user => {
                        setUser(user)
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }) : alertMember('2')}/>
                </View>
            </View>

            {/*词列*/}
            <View style={styles.imWord}>
                {columnLi.map((item, index) =>
                    <Text key={'iw' + index} style={styles.imWords}> {item} </Text>
                )}
            </View>

            {/*发送消息*/}
            <View style={[styles.imInput, C1, {paddingLeft: 10, paddingRight: 10}]}>
                {/*选择图片发送*/}
                <OssImage userID={user._id} cb={(url) => {
                    let imData = {
                        "user": user._id,
                        "list": list,
                        "to": to,
                        "url": url,
                        "tIm": 2
                    }
                    // console.log('发送图片', imData)
                    socket.emit('im', imData)
                }}/>
                <TextInput value={input}
                           multiline={true}
                           style={[styles.imInputSend, styles.T5, MsgColor, MstText]}
                           onFocus={({nativeEvent: {target}}) => {
                               _ref.current.scrollToEnd({animated: true})
                           }}   //调整位置
                           onTextInput={({nativeEvent: {text, previousText, range: {start, end}}}) => {
                               let reg = /[^\u0000-\u00FF]/
                               //词裂功能
                               if (reg.test(text.trim()) && user.column) {
                                   console.log('词列', text)
                                   _Column(text, cb => {
                                       let columnArr = columnRef.current  //词列
                                       columnArr.push(cb)
                                       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                       setColumnLi([...columnArr])
                                   })
                               }
                               //重制词列
                               if (start == 0) {
                                   console.log('重置词列')
                                   setColumnLi([...[]])
                               }
                           }}
                           onChangeText={text => setInput(text)}/>
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
                    </TouchableOpacity> :
                    <Record userID={user._id} start={() => {
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
                        // console.log('发送声音', url, imData)
                        socket.emit('im', imData)
                    }}/>}

            </View>
        </View>
    </View>
}

// 左边信息
function LeftMsg(props) {
    const {onIm, onSound, data, i, omWord, onRecall} = props
    const colorScheme = useColorScheme();
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const lightNsgBcB = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框分割线
    const window = useWindowDimensions();
    const [show, setShow] = useState(false) //操作键

    switch (data.tIm) {
        case 1:
            return <View style={[styles.msgRow]}>
                <View style={[{flexDirection: "row", alignItems: "center"}]}>
                    <TouchableOpacity style={[styles.msgText, {maxWidth: (0.6 * window.width)}, MsgColor]}
                                      onPress={() => onSound(i, data)} onLongPress={() => {
                        setShow(true)
                        setTimeout(() => {
                            setShow(false)
                        }, 3000)
                    }}>
                        <Text style={[styles.T5, MstText, styles.en, {opacity: 0.8}]}>{data.q}</Text>
                        <Text style={[styles.T6, MstText, styles.en, {opacity: 0.8}]}>{data.enQ}</Text>
                    </TouchableOpacity>
                    {i == onIm ? <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable}>
                        <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>
                    </TouchableHighlight> : ''}
                </View>
                {show ? <View style={[styles.flot, MsgColor]}>

                    {data.word.length ? <TouchableOpacity onPress={() => omWord(data.word)}>
                        <Text style={[MstText, styles.flotText]}> 词典 </Text>
                    </TouchableOpacity> : ''}
                    {data.word.length ? <View style={[styles.flotHx, lightNsgBcB]}></View> : ''}

                    <TouchableOpacity onPress={() => {
                        _addStore({
                            url: data.url,
                            tIm: 1,
                            word: data.word,
                            user: data.user._id,
                            q: data.q,
                            enQ: data.enQ
                        })
                        setShow(false)
                    }}>
                        <Text style={[styles.flotText, MstText]}>收藏 </Text>
                    </TouchableOpacity>
                    <View style={[styles.flotHx, lightNsgBcB]}></View>
                    <TouchableOpacity onPress={async () => {
                        await Clipboard.setStringAsync(data.enQ)
                        setShow(false)
                    }}>
                        <Text style={[styles.flotText, MstText]}>复制译文</Text>
                    </TouchableOpacity>
                </View> : ''}
            </View>
            break;
        case 2:
            return <TouchableHighlight style={[styles.msgRow]}>
                <MsgImg url={data.url}/>
            </TouchableHighlight>
            break;
        case 3:
            return <View style={[styles.msgRow, {flexDirection: "row", alignItems: "center"}]}>
                <TouchableOpacity style={[styles.msgText, {width: data.q < 20 ? 20 + (data.q * 10) : 100}, MsgColor]}
                                  onPress={() => onSound(i, data)}>
                    <Text style={[styles.T5, MstText, styles.en, {opacity: 0.8}]}>{data.q} "</Text>
                </TouchableOpacity>
                {i == onIm ? <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text> : ''}
            </View>
            break;
        case 4:
            return <Text style={[styles.time, MstText, {width: window.width, opacity: 0.3}]}>{timeIm(data.q)}</Text>
            break
    }
}

// 右边信息
function RightMsg(props) {
    const {onIm, data, i, onSound, omWord, onRecall} = props
    const colorScheme = useColorScheme();
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const lightNsgBcB = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框分割线
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
                        onPress={() => onSound(i, data)} onLongPress={() => {
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
                        })
                        setShow(false)
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
                <TouchableHighlight onLongPress={() => Alert.alert('撤回这张图片', '消息撤回后，将不可见', [
                    {
                        text: "确定",
                        onPress: () => onRecall(data._id)
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
            return <Text style={[styles.time, MstText, {width: window.width, opacity: 0.3}]}>{timeIm(data.q)}</Text>
            break
    }
}


//图像裁切
function MsgImg(props) {
    const [w, setW] = useState(200)
    const [h, setH] = useState(200)

    const window = useWindowDimensions();
    useEffect(() => {
        Image.getSize(props.url, (w, h) => {
            let maxWidth = window.width * 0.7
            // console.log(maxWidth, '像素', window.width, w, maxWidth / w, h)
            if (window.width < w) {
                setH(h * (maxWidth / w))
                setW(maxWidth)
            } else {
                setH(h)
                setW(w)
            }
        })
    }, [])

    return <Image
        style={[{width: w, height: h, borderRadius: 5}]}
        source={{
            uri: props.url,
        }}
    />
}

