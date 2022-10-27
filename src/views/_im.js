// 对话页面
import {
    Button,
    FlatList,
    Alert,
    useWindowDimensions,
    SafeAreaView,
    Text,
    useColorScheme,
    View, TextInput, TouchableHighlight, Image, ScrollView, TouchableOpacity, ActivityIndicator, Pressable
} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {styles} from "../../css";
import {Btn} from "../set";
import { Audio } from 'expo-av';
import {pickImage} from "../utils/oss";
import {_listLI} from "../model/_list";
import {AudioSound, Recording} from "../utils/audio";

let m4a = 'https://boatlmtext.oss-cn-guangzhou.aliyuncs.com/obj_wonDkMOGw6XDiTHCmMOi_3058352428_28ac_5055_a810_16dd4fbad431d482ad28049b9e1b4f5f.m4a'


//消息记录
export function _im({route, navigation}){

    const theme = useColorScheme()
    const themeStyles =theme == 'dark'?styles.dark:styles.light
    const themeT1 = theme == 'dark' ? styles.darkT1 : styles.lightT1
    const themeT2 = theme == 'dark' ? styles.darkT2 : styles.lightT2
    const lightInput = theme == 'dark' ? styles.darkInput : styles.lightInput
    const themeHx = theme == 'dark' ? styles.darkHx : styles.lightHx
    const imLine = theme == 'dark' ? styles.darkImLine : styles.lightImLine



    const [load,setLoad] = useState(false)

    const [record,setRecord] = useState(false)      //录音
    const [audio,setAudio] = useState('')   //播放音频
    const [upImg,setUpImg] = useState(false)    //上传图片
    const [text,setText] = useState('')    //输入文字
    const [focus,setFocus]= useState(false) //文本框焦点

    const _ref = useRef(null)
    const { id, name } = route.params;
    const windowHeight = useWindowDimensions();

    useEffect(()=>{
        console.log('进入对话,链接信道')
        navigation.setOptions({
            headerRight: () => <Btn title={'⚙️'} cb={(e)=>Alert.alert(
                "Alert Title",
                "My Alert Msg",
                [
                    {
                        text: "取消",
                        onPress: () => Alert.alert("取消 Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "确认",
                        onPress: () => Alert.alert("确认 Pressed"),
                        style: "default",
                    },
                ]
            )} />
        })
        return ()=>{
            console.log('退出对话,卸载信道')
        }
    },[])

    const [i,setI]=useState(8)


    //加载聊天记录
    function upData() {
        setLoad(true)
        setTimeout(()=>{
            setLoad(false)
        },800)
    }

    const cRef = useRef(null);
    return  <SafeAreaView style={[themeStyles,styles.im]}>

        {/*//播放音乐*/}
        <AudioSound ref={cRef} url={m4a} />

        <FlatList
            style={styles.imList}
            ref={(flatList)=> _ref.flatList = flatList}
            data={data}
            refreshing={load}
            onRefresh={upData}
            renderItem={({item,index}) => <Msg {...{lightInput,index,themeT1,themeT2,themeHx}} onAudio={async uri=>{
                console.log('音频链接',uri)
                await cRef.current.playSound()
            }} />}
        />

        {/*发送消息*/}
        <View style={[styles.imSend]}>

            {/*功能开光*/}
            <View style={styles.imFun}>
                <View style={true?'':styles.imFunA}>
                    <Btn title={'✍️'}  cb={()=>console.log(222) } />
                </View>
                <View style={false?'':styles.imFunA}>
                    <Btn title={'🎧️'}  cb={()=>console.log(11)} />
                </View>

            </View>

            {/*词列*/}
            <View style={styles.imWord}>
                <Text style={[styles.imWords,lightInput,themeT1]}>HELLO </Text>
                <Text style={[styles.imWords,lightInput,themeT1]}>WORLDELLO</Text>
            </View>

            <View style={[styles.imInput,styles.BtnT1Bj,themeStyles,imLine]}>
                {upImg? <ActivityIndicator />:<Btn title={'📷️ '}  cb={ async ()=>{
                    setUpImg(true)
                    pickImage().then(res=>{
                        setUpImg(false)
                        console.log('上传图片', res )
                    },err=>{
                        setUpImg(false)
                    })
                }} />}

                {/*录用提示*/}
                {record?<Text  style={[styles.imTextRecord,themeT1,lightInput]} > 松手即可发送 </Text>
                    :<TextInput defaultValue={text} style={[styles.imTextInput,themeT1,lightInput]}
                                onFocus={()=>setFocus(true)}
                                onBlur={()=>setFocus(false)}
                                onChangeText={(e)=>setText(e)}
                                multiline={true}/>}

                {/*录音，文字输入状态切换*/}
                {focus?<Btn title={'💬️'}  cb={()=>{
                        console.log('发送文本消息',text)
                        setText('')
                }} />
                    : <Recording {...{setFocus,setRecord}} />}
            </View>


        </View>
    </SafeAreaView>
}


//对话内容
function Msg(props){
    return <View style={[styles.Msg]}>
        {props.index%2 ===0?<View style={[styles.MsgItem]}>
            <Image
                style={styles.MsgImg}
                source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
            />
            {LeftMsg(1,props)}
        </View>: <View style={[styles.MsgItem,styles.MsgItemR]}>
            {RightMsg(1,props)}
        </View>}
    </View>
}

// 左边
function LeftMsg(type,props){
    const theme = useColorScheme();
    const themeStyles = theme == 'dark'?styles.dark:styles.light
    const themeT2 = theme == 'dark' ? '#333C52' : '#EAEAEA'
    switch (type){
        case 1: //文本
            return <View style={[styles.MsgRow]}>

                <View style={[styles.MsgText,props.lightInput]}>
                    <TouchableHighlight  activeOpacity={0.3}
                                         underlayColor={themeT2}
                                         onPress={()=>alert('1111')} >
                        <Text style={[props.themeT1,styles.MsgT1]}>你好世界你好世界你好世界你好世界你好世界你好世界</Text>

                    </TouchableHighlight>


                    {/*<View style={[styles.hx,props.themeHx]}></View>*/}
                    <TouchableHighlight activeOpacity={0.3}
                                        underlayColor={themeT2}
                                        onPress={()=>alert('1111')}>
                        <Text style={[props.themeT2,styles.MsgT2]}>HELLO WORLDELLO WORLDELLO WORLDELLO WORLD</Text>
                    </TouchableHighlight>

                </View>

                <TouchableHighlight onPress={()=>props.onAudio('播放vidoe')} style={{borderRadius:10}} >
                    <View  style={[styles.MsgBo,themeStyles]}>
                        <Text style={[styles.MsgBoText]}>🎵</Text>
                    </View>

                </TouchableHighlight>
            </View>
            break;
        case 2:
            return  <View style={[styles.MsgText,props.lightInput]}>
                <Text style={[props.themeT1,styles.MsgT1]}>34 "</Text>
            </View>
        break;
        case 3:
            return <MsgImg/>
            break
        case 4:
            return  <Text style={[props.themeT2,styles.TimeText]} > 3分钟 </Text>
            break
    }
}


// 右边数据
function RightMsg(type,props){
    const theme = useColorScheme();
    const themeStyles = theme == 'dark'?styles.dark:styles.light
    switch (type){
        case 1:
            return <View style={[styles.MsgRowRight]}>
                <TouchableHighlight  onPress={()=>props.onAudio('播放audio2')} style={{borderRadius:10}} >
                    <View style={[styles.MsgBo,themeStyles]}>
                        <Text style={[styles.MsgBoText]}>🎵</Text>
                    </View>
                </TouchableHighlight>
                <View style={[styles.MsgRight]}>
                    <TouchableHighlight  activeOpacity={0.3}
                                         underlayColor="#5A8DFF"
                                         onPress={()=>alert('1111')} >
                        <Text style={[styles.MsgT1,styles.MsgRightText]}>世界世界世界世界世界世界世界世界</Text>
                    </TouchableHighlight>


                    {/*<View style={[styles.hxs]}></View>*/}
                    <TouchableHighlight  activeOpacity={0.3}
                                         underlayColor="#5A8DFF"
                                         onPress={()=>alert('1111')} >
                        <Text style={[styles.MsgT2,styles.MsgRightText]} >HELLO WORLD</Text>
                    </TouchableHighlight>

                </View>
            </View>
            break
        case 2:
            return  <View style={[styles.MsgRight]}>
                <Text style={[styles.MsgT1,styles.MsgRightText]}>34 "</Text>
            </View>
        break;
        case 3:
            return <MsgImg/>
            break;
        case 4:
            return  <Text style={[themeT2,styles.TimeText]} > 3分钟 </Text>
            break;
    }
}

//图片
export function MsgImg(){
    const [w,setW]= useState(0)
    const [h,setH]= useState(0)

    const window = useWindowDimensions();
    // let url ='https://reactnative.dev/img/tiny_logo.png'
    let url ='https://grocery-cdn.huaban.com/file/a8dd66b0-fc09-11ec-9fff-7b7c4a1c3215.png'

    useEffect(()=>{
        Image.getSize(url,(w,h)=>{
            if(window.width*0.5<w){
                console.log('2323',w*0.5)
                setH(h*0.5)
                setW(w*0.5)
            }else {
                setH(h)
                setW(w)
            }
        })
    },[])

    return <Image
        style={[styles.MsgImgs,{width:w,height:h}]}
        source={{
            uri: url,
        }}
    />
}



const data = [
    {key: 'Devin'},
    {key: 'Dan'},
    {key: 'Dominic'},
    {key: 'Jackson'},
    {key: 'James'},
    {key: 'Joel'},
    {key: 'John'},
    {key: 'Jillian'},
    {key: 'Jimmy'},
    {key: 'Julie'},
]


{/*<TouchableHighlight onPress={()=>{}}>*/}
{/*    <View style={[themeStyles]}>*/}
{/*        <Text style={styles.imFunBtn}>💬</Text>*/}
{/*    </View>*/}
{/*</TouchableHighlight>*/}


// <Button title="Go back" onPress={() => navigation.goBack()} />
