import {
    ActivityIndicator, Alert,
    Button, FlatList,
    Image, RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableHighlight,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import {Component, useEffect, useRef, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Portrait} from "../component/Portrait";
import {Btn} from "../component/btn";
import {useFocusEffect} from "@react-navigation/native";
import {_Column, _Msg, _onColumn, _onListen, _Unread, _User} from "../_Api";
import {io} from "socket.io-client";
import {OssImage, pickImage} from "../utils/oss";
import * as ImagePicker from "expo-image-picker";
import {Record} from "../utils/record";
import {Audio} from 'expo-av';
import {timeIm} from "../utils/time";
import KeyboardAvoidingView from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";

const socket = io('ws://192.168.0.104:3000')
const host = 'http://192.168.0.104:3000/audio/'

export function Im({route, navigation}) {
    const colorScheme = useColorScheme();

    // 路由参数
    const {list , name, to,unread} = route.params;

    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色

    const [user,setUser] = useState({}) //用户信息
    const userRef = useRef(user)
    userRef.current = user

    const [input, setInput] = useState('')  //输入信息
    const [audioLoad, setAudioLoad] = useState()  //录制声音
    const [sounds, setSound] = useState();   // 播放声音
    const [seconds, setSeconds] = useState(1)   //计时时长
    const [imi,setImi] = useState(null)     //选中项目
    const [columnLi,setColumnLi] = useState([]) //词列

    const columnRef = useRef(columnLi)      //词裂展开
    columnRef.current = columnLi

    const _ref = useRef(null)           //ScrollView 控制器
    const [msgArr, setMsgArr] = useState([])        //对话列表
    const msgRef = useRef(msgArr)
    msgRef.current = msgArr


    const _interval = useRef()  //计时器
    const window = useWindowDimensions();

    //播放声音
    const [soundIndex,setSoundIndex] = useState(null)  //播放声音下标
    async function onPlaySound(url) {
        const {sound} = await Audio.Sound.createAsync({uri:url});
        setSound(sound);
        console.log('Playing Sound');
        await sound.playAsync();

        // Alert.alert('还未开通','还未开通',[
        //     {
        //         text: "取消",
        //         onPress: () => console.log("Cancel Pressed"),
        //     },
        //     {
        //         text: "成为会员",
        //         onPress: () => console.log("OK Pressed")
        //     }
        // ])

    }

    useEffect(() => {
        return sounds
            ? () => {
                console.log('Unloading Sound');
                sounds.unloadAsync();
            }
            : undefined;
    }, [sounds]);

    // 路由生命周期
    useFocusEffect(React.useCallback(() => {
        console.log(`进入im，信道: ${list}`)
        navigation.setOptions({title: name})

        //获取用户信息
        _User(cb=>setUser(cb))

        // 接收信息
        socket.on(list, (im) => {
            let arr = msgRef.current
            arr.push(im)
            console.log('im:',arr.length,im)
            setMsgArr([...arr])
            setTimeout(()=>_ref.current.scrollToEnd({animated:true}),100)

            //跟读信号
            if( userRef.current.listen&&im.url!='null'){
                onPlaySound( host+im.url)
                setImi(arr.length-1)
            }
        });

        // 加载对话内容
        _Msg(list, cd => {
            console.log('滚动对话、、', cd.length)
            setMsgArr(cd)
            cd.length? setTimeout(()=>_ref.current.scrollToEnd({animated:true}),100):''

        })

        return () => {
            // 更新时间戳
            let msgSlice = msgRef.current.length?msgRef.current[msgRef.current.length-1]:{tIm:4}
            console.log('离开im,断开链接', msgSlice.tIm)
            if(msgSlice.tIm != 4){
                let time = new Date()
                let imData = {
                    "user": userRef.current._id,
                    "list": list,
                    "to": to,
                    "q": time,
                    "tIm": 4
                }
                socket.emit('im', imData)
                console.log('更新时间戳',user._id)
            }
            socket.off(list)
            if(unread){
                _Unread(list,userRef.current._id)
            }

        }
    }, []))

        //下啦刷新
    const [load, setLoad] = useState(false)
    const onRefresh = (e)=>{
        setLoad(true)
        console.log('222', e )
        setTimeout(()=>{
            setLoad(false  )
        },600)
    }


    return <View style={[C1, styles.Im]}>

        {/*录音推送*/}
        {audioLoad ? <View style={[styles.audioModel, {height: window.height}]}>
            <View style={[styles.audioBody, MsgColor]}>
                <Text style={[styles.T1, MstText, {fontWeight: '600'}]}>{seconds} "</Text>
                {/*<Image style={styles.audioIcon}  source={require('../img/audio.png')} />*/}
                <Text style={[styles.T5, styles.Send, MstText, {marginTop: 5}]}>松手即可发送</Text>
            </View>
        </View> : ''}

        {/*对话内容*/}
        <ScrollView
            refreshing={true}
            refreshControl={<RefreshControl refreshing={load} onRefresh={onRefresh} />}
            keyboardDismissMode={"on-drag"}
            ref={_ref} >
            {msgArr.map((item,index)=>item.user == user._id ?
                // 自己发送
                <RightMsg key={'msg'+index}
                          tIm={item.tIm}
                          audio={onPlaySound}
                          i={index}
                          imIndex={imi}
                          onIndex={i=>{
                              let url = msgArr[i].url
                              //播放译文
                              if(url!='null'){
                                  setImi(i)
                                  console.log(url)
                                  onPlaySound(msgArr[i].tIm==3?url:host+url)
                              }
                          }}
                          data={{q: item.q, enQ: item.enQ, url: item.url}}/> :
                // 别人的
                <View style={styles.ImMsg} key={'msg'+index}>
                    {item.tIm!=4?<Portrait w={32} h={32} r={7} t={'😢'} url={item.to.avatar}/>:''}
                    <LeftMsg tIm={item.tIm}
                             i={index}
                             audio={onPlaySound}
                             imIndex={imi}
                             onIndex={i=>{
                                 let url = msgArr[i].url
                                 //播放译文
                                 if(url!='null'){
                                     setImi(i)
                                     console.log(url)
                                     onPlaySound(msgArr[i].tIm==3?url:host+url)
                                 }
                             }}
                             data={{q: item.q, enQ: item.enQ, url: item.url}}/>
                </View>)}
            <View style={{height:70}}></View>
        </ScrollView>


        {/*发送信息*/}
        <KeyboardAvoidingView style={[styles.imSend]}>
            {/*操作列表*/}
            <View style={styles.imFun}>
                <View style={user.column?'':{opacity: 0.3}} >
                    <Btn text={'✍️'}  fs={16} press={() =>_onColumn(!user.column,user=>setUser(user)) }/>
                </View>
                <View style={user.listen?'':{opacity: 0.3}} >
                    <Btn text={'🎧️️'} fs={16} press={() => _onListen(!user.listen,user=>setUser(user))}/>
                </View>

            </View>

            {/*词列*/}
            <View style={styles.imWord}>
                {columnLi.map((item,index)=>
                    <Text key={'iw'+index} style={styles.imWords}> {item} </Text>
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
                    console.log('发送图片', imData)
                    socket.emit('im', imData)
                }}/>
                <TextInput value={input}
                           style={[styles.imInputSend, styles.T5, MsgColor, MstText]}
                           onTextInput={({ nativeEvent: { text, previousText, range: { start, end } } })=>{
                               // console.log('111',text,'new1:', previousText,'222',start,end)
                               let reg =  /[^\u0000-\u00FF]/
                               //词裂功能
                               if(reg.test(text.trim()) && user.column ){
                                   console.log('text', text)
                                   _Column(text,cb=>{
                                       let columnArr = columnRef.current  //词列
                                       // console.log('111',cb)
                                       columnArr.push(cb)
                                       setColumnLi([...columnArr])
                                   })
                               }

                               //重制词列
                               if(start==0){
                                   console.log('重置词列')
                                   setColumnLi([...[]])
                               }

                           }}
                           onChangeText={text =>setInput(text)}
                           multiline={true}/>
                {input.length ? <Btn text={'💬️'} fs={20} press={() => {
                    setInput('')
                    let imData = {
                        "user": user._id,
                        "list": list,
                        "to": to,
                        "listen":user.listen?true:false,
                        "q": input,
                        "tIm": 1
                    }
                    console.log('输入信息', imData)
                    socket.emit('im', imData)
                }}/> : <Record userID={user._id} start={() => {
                    //开始录音
                    setAudioLoad(true)
                    setSeconds(0)
                    _interval.current = setInterval(() => {
                        setSeconds(seconds => seconds + 1);
                    }, 1000);
                }} stop={(ell) => {
                    // 停止录音
                    setAudioLoad(false)
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
                    console.log('发送声音', url, imData)
                    socket.emit('im', imData)
                }}/>}

            </View>
        </KeyboardAvoidingView>

        {/*<Text> 发送对话页面 </Text>*/}
    </View>
}


// 右边信息
function LeftMsg(props) {
    const {tIm, data, i,imIndex,onIndex} = props
    const colorScheme = useColorScheme();
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const lightNsgBcB = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框分割线
    const window = useWindowDimensions();

    switch (tIm) {
        case 1:
            return <View style={[styles.msgRow]}>
                <View style={[styles.msgText,{maxWidth:(0.6*window.width)}, MsgColor]}>
                    <TouchableHighlight activeOpacity={0.3}
                                        underlayColor={MsgColorTouchable}
                                        onPress={() => console.log('111')}>
                        <Text style={[styles.T5, styles.zh, MstText, lightNsgBcB]}>{i}: {data.q}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable} onPress={() =>onIndex(i)}>
                        <Text style={[styles.T6, MstText, styles.en, {opacity: 0.8}]}> {data.enQ}</Text>
                    </TouchableHighlight>
                </View>
                {i==imIndex? <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable}>
                    <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>
                </TouchableHighlight>:''}

            </View>
            break;
        case 2:
            return <View style={[styles.msgRow]}>
                <TouchableHighlight activeOpacity={0.5}
                                    underlayColor={MsgColorTouchable}
                                    onPress={() => {
                                    }}>
                    <MsgImg url={data.url}/>
                </TouchableHighlight>
            </View>
            break;
        case 3:
            return <View style={[styles.msgRow]}>
                <TouchableHighlight style={[styles.msgText, MsgColor]} activeOpacity={0.3}
                                    onPress={() => onIndex(i)}
                                    underlayColor={MsgColorTouchable}>
                    <Text
                        style={[styles.T5, styles.en, MstText, {width: data.q < 20 ? 20 + (data.q * 10) : 100}]}> {data.q} "</Text>
                </TouchableHighlight>
                {i==imIndex? <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable}>
                    <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>
                </TouchableHighlight>:''}
            </View>
            break;
        case 4:
            return <View>
                <Text style={[styles.time,MstText,{width:window.width,opacity: 0.3}]} >{timeIm(data.q)}</Text>
            </View>
        break

    }


}

// 左边信息
function RightMsg(props) {
    const {tIm, data,i,imIndex,onIndex} = props
    const colorScheme = useColorScheme();
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const window = useWindowDimensions();
    switch (tIm) {
        case 1:
            return <View style={[styles.msgRowRight]}>
                {i==imIndex?<TouchableHighlight>
                    <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>
                </TouchableHighlight>:''}

                <View style={[styles.msgText, {backgroundColor: '#5A8DFF',maxWidth:(0.6*window.width)}]}>
                    <TouchableHighlight underlayColor={'#5A8DFF'} onPress={() => console.log('111')}>
                        <Text style={[styles.T5, styles.zh, {color: "#fff"}]}>{i}:{data.q}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#5A8DFF'} onPress={() =>onIndex(i)}>
                        <Text style={[styles.T6, styles.en, {color: "#fff"}, {opacity: 0.8}]}> {data.enQ}</Text>
                    </TouchableHighlight>
                </View>


            </View>
            break;
        case 2:
            return <View style={[styles.msgRowRight]}>
                <TouchableHighlight underlayColor={MsgColorTouchable}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                    }}>
                    <MsgImg url={data.url}/>
                </TouchableHighlight>
            </View>
            break;
        case 3:
            return <View style={[styles.msgRowRight]}>
                {i==imIndex?<TouchableHighlight>
                    <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>
                </TouchableHighlight>:''}
                <View style={[styles.msgText, {backgroundColor: '#5A8DFF'}]}>
                    <TouchableHighlight underlayColor={'#5A8DFF'} onPress={() => onIndex(i)}>
                        <Text style={[styles.T5, styles.en, {
                            color: "#fff",
                            opacity: 0.8,
                            width: data.q < 20 ? 20 + (data.q * 10) : 100
                        }]}> {data.q} "</Text>
                    </TouchableHighlight>
                </View>
            </View>
            break;
        case 4:
            return <View>
                <Text style={[styles.time,MstText,{width:window.width,opacity: 0.3}]} >{timeIm(data.q)}</Text>
            </View>
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
            console.log(maxWidth, '像素', window.width, w, maxWidth / w, h)
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

