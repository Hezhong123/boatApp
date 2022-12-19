import {
    ActivityIndicator,
    Alert,
    FlatList, Image, Modal,
    Text,
    TextInput,
    TouchableHighlight, TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import {styles} from "../css";
import {Portrait} from "../component/portrait";
import * as React from "react";
import {useFocusEffect} from '@react-navigation/native';
import {_addStore, _name, _storeDel, _storeLi, _storeQuery, _User} from "../_Api";
import {Btn, TextClick} from "../component/btn";
import * as ImagePicker from "expo-image-picker";
import {upAvatar} from "../utils/oss";
import {Audio} from "expo-av";
import {memberFun} from "../utils/time";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
const host = 'http://192.168.0.100:3000/audio/'



export function Me({navigation}) {
    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const MeBbc = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const placeholderColor =  colorScheme == 'light' ? '#222222' :'#ffffff'    //输入框

    const [load, setLoad] = useState(false)
    const [user, setUser] = useState({})
    const userRef = useRef(user)
    userRef.current = user

    const [name, setName] = useState('')    //昵称
    const [upName, setUpName] = useState(false)    //修改昵称
    const [store, setStore] = useState([])       //收藏列表
    const [on,setOn] = useState(NaN)
    const [word, setWord] = useState([])     //词典

    navigation.addListener('focus', () => {
        console.log('更新用户信息')
        _User(cb => {
            setUser(cb)
            _storeLi(cb => {
                console.log('收藏列表', cb)
                setStore(cb)
            })
        })
        navigation.setOptions({
            title: "我的",
            headerRight: () => <Text style={[styles.T4, C2, styles.bold,]} onPress={() => Alert.alert('退出登陆', '', [
                {
                    text: '确定',
                    onPress: () => {
                        AsyncStorage.removeItem('token')
                        AsyncStorage.removeItem('tokenIn')
                        navigation.navigate('Login')
                    }
                },
                {
                    text: '取消',
                    onPress: () => {
                    }
                },
            ])}>登出</Text>
        })
        return () => {
            console.log('离开我的',)
        };
    })


    //搜索text内容
    function onStore(text) {
        setStore([])
        let arr = store
        _storeQuery(text, cb => {
            console.log('搜索收藏', cb)
            if(cb.length){
                setStore(cb)
            }else {
                Alert.alert('搜索结果', '没有你想要的结果、',[
                    {
                        text:'ok',
                        onPress:()=> setStore(arr)
                    }
                ])
            }

        })
    }

    //播放声音
    const [sound, setSound] = React.useState();
    const playSound = async ( i,url) => {
        console.log('播放声音',i,url)
        if (url != 'null') {
            setOn(i)
            const {sound} = await Audio.Sound.createAsync({uri: url});
            setSound(sound);
            console.log('Playing Sound');
            await sound.playAsync();
        } else {
            setOn(NaN)
            sound.unloadAsync();
        }
    }
    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])


    return <View style={[styles.Me, C1]}>
        {/*个人信息*/}
        <View style={styles.MeUse}>
            <TouchableHighlight
                underlayColor={MsgColorTouchable}
                onPress={() => Alert.alert('替换头像', '', [
                    {
                        text: '换头像',
                        onPress: () => upAvatar(user.id, cb => {
                            setUser(cb)
                        })
                    },
                    {
                        text: '取消',
                        onPress: () => {
                        }
                    },
                ])}
            >
                <Portrait w={52} h={52} r={50} t={user.emoji} url={user.avatar}/>
            </TouchableHighlight>

            <View style={styles.MeUseText}>
                {upName ? <View style={styles.upName}>
                    <TextInput returnKeyType={"done"}
                               style={[styles.upNameInput,MstText, {backgroundColor: MsgColorTouchable}]}
                               defaultValue={user.name}
                               onSubmitEditing={({nativeEvent: {text, eventCount, target}})=>Alert.alert(
                                   '昵称变动', '确认修改为:'+text, [
                                   {
                                       text: '确定',
                                       onPress: () => {
                                           _name(text, newUser => setUser(newUser))
                                           setUpName(false)
                                       }
                                   },
                                   {
                                       text: '取消',
                                       onPress: () => console.log(111)
                                   }
                               ])}/>
                    {/*<Btn text={'👌'} fs={18} press={() => }/>*/}
                </View> : <TouchableHighlight
                    underlayColor={MsgColorTouchable}
                    onPress={() => Alert.alert('修改昵称', '', [
                        {
                            text: '修改',
                            onPress: () => setUpName(true)
                        },
                        {
                            text: '取消',
                            onPress: () => {
                            }
                        },
                    ])}>
                    <Text style={[styles.T3, styles.bold, C2]}>{user.name} </Text>
                </TouchableHighlight>}
                <Text style={[styles.T5, C2, styles.bold, {opacity: 0.9, marginTop: 6}]}>🆔 {user.id} </Text>
            </View>
            <Text>  </Text>
            <Text style={[styles.T5, styles.bold, styles.vip, {borderWidth: 0}]}
                  onPress={() => Alert.alert('激活码',
                      '【词裂】提高词汇与句法，【跟读】加强听力口语', [
                          {
                              text: '激活码',
                              onPress: () => navigation.navigate('Ticket')
                          },
                          {
                              text: '充值',
                              onPress: () => Alert.alert('正在开发中、','')
                          },
                          {
                              text: '取消',
                              onPress: () => {
                              }
                          },
                      ])}>{memberFun(user.member)}</Text>


        </View>

        {/*搜索收藏*/}
        <View style={[styles.MeInput]}>
            <Text style={[MstText, styles.T5, styles.bold]}>🔍</Text>
            <TextInput style={[styles.MeInputs, styles.T5, MsgColor, MstText,{marginRight: 10}]}
                       placeholder={'搜索收藏夹'}
                       placeholderTextColor={placeholderColor}
                       returnKeyType={"search"}
                       onSubmitEditing={({nativeEvent: {text, eventCount, target}})=>onStore(text)} />
        </View>

        {/*词典*/}
        <Modal
            visible={Boolean(word.length)}
            onRequestClose={()=>setWord([])}
            transparent={true}
            presentationStyle={'overFullScreen'}
            animationType="slide">
            <View style={[styles.Word]}>
                <Text style={[styles.T4,styles.WordBtn]} onPress={()=>setWord([])}>❌</Text>
                <View style={[styles.Words,C1]}>
                    {word.map((item,index)=><TouchableOpacity key={'wodr'+index}>
                        <Text style={[styles.T5,styles.bold,{marginTop:5,marginBottom:10},MstText]} >{item.key} </Text>
                        {item.value.map((items,i)=> <View key={'wodrs'+i}>
                            <Text style={[styles.T5, MstText, {marginBottom:10,opacity: 0.8}]}>{items} </Text>
                        </View>)}
                        <View style={[BbC, styles.listBbC]}></View>
                    </TouchableOpacity>)}
                </View>
            </View>
        </Modal>

        {store.length?<FlatList
            data={store}
            refreshing={load}
            onRefresh={() => _storeLi(cb => {
                console.log('收藏列表', cb)
                setStore(cb)
            })}
            renderItem={({item, index}) => <View style={[styles.ImMsg, {marginLeft: 15}]}>
                <Portrait w={32} h={32} r={7} url={item.user.avatar} t={item.user.emoji}/>
                <LeftMsg data={item}
                         i={index}
                         on={on}
                         omWord={(cd)=>setWord(cd)}        //点击词典
                         onSound={(i,url)=>playSound(i,url)}
                         storeUp={() => _storeLi(cb => {   //重载
                             setStore(cb)
                         })}/>
            </View>}
        />:<ActivityIndicator />}

    </View>
}



function LeftMsg(props) {
    const {data, storeUp,onSound,i,on,omWord} = props
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
                                      onPress={() =>data.url == 'null'?onSound(i,'null'): onSound(i,host+data.url)} onLongPress={() => {
                        setShow(true)
                        setTimeout(() => {
                            setShow(false)
                        }, 3000)
                    }}>
                        <Text style={[styles.T5, MstText, styles.en, {opacity: 0.8}]}>{data.q}</Text>
                        <Text style={[styles.T6, MstText, styles.en, {opacity: 0.8}]}>{data.enQ}</Text>
                    </TouchableOpacity>
                    {i == on? <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>:''}
                </View>
                {show ? <View style={[styles.flot, MsgColor]}>

                    {data.word.length?<TouchableOpacity onPress={()=>omWord(data.word)}>
                        <Text style={[MstText, styles.flotText]} > 词典 </Text>
                    </TouchableOpacity>:''}
                    {data.word.length? <View style={[styles.flotHx, lightNsgBcB]}></View>:''}

                    <TouchableOpacity onPress={() =>_storeDel(data._id,cb=>{
                        storeUp()
                        setShow(false)
                    })}>
                        <Text style={[styles.flotText, MstText]} >删除 </Text>
                    </TouchableOpacity>
                    <View style={[styles.flotHx, lightNsgBcB]}></View>
                    <TouchableOpacity onPress={async () => {
                        await Clipboard.setStringAsync(data.enQ)
                        setShow(false)
                    }}>
                        <Text style={[styles.flotText, MstText]} >复制译文</Text>
                    </TouchableOpacity>
                </View> : ''}
            </View>
            break;
        case 2:
            return <View style={[styles.msgRow]}>
                <TouchableHighlight style={[styles.msgText, MsgColor]} activeOpacity={0.3}
                                    onPress={() => {
                                    }}
                                    underlayColor={MsgColorTouchable}>
                    <Text style={[styles.T5, styles.en, MstText]}> 34 "</Text>
                </TouchableHighlight>
            </View>
            break;
        case 3:
            return <View style={[styles.msgRow]}>
                <TouchableHighlight activeOpacity={0.5}
                                    underlayColor={MsgColorTouchable}
                                    onPress={() => {
                                    }}>
                    <MsgImg/>
                </TouchableHighlight>
            </View>
            break;
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
