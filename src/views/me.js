// 我的
import {
    Alert,
    FlatList, Modal,
    Text,
    TextInput,
    TouchableHighlight, TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import {BbC, bColor, fColor, lightNsgBcB, MsgColor, MsgColorTouchable, MstText, placeholderColor, styles} from "../css";
import {useEffect, useRef, useState} from "react";
import {_Name, _StoreDel, _StoreLi, _StoreQuery, _User, url} from "../utils/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Portrait} from "../components/Portrait";
import {memberFun} from "../utils/time";
import {Audio} from "expo-av";
import * as Clipboard from "expo-clipboard";
import {MsgImg, upAvatar} from "../utils/oss";

export function Me({navigation}){
    const schemes = useColorScheme();
    const [user, setUser] = useState({})
    const [refresh, setRefresh] = useState(false) //加载更新
    const [store, setStore] = useState([])       //收藏列表

    const [name, setName] = useState('')    //昵称
    const [upName, setUpName] = useState(false)    //修改昵称
    const [on,setOn] = useState(NaN)    //播放下标
    const [word, setWord] = useState([])     //词典

    //路由生命周期
    navigation.addListener('focus', async () => {
        setUser(await _User())
        setStore([...await _StoreLi()])
        navigation.setOptions({
            title: "我的",
            headerRight: () => <Text style={[styles.T4, fColor(schemes), styles.bold,]} onPress={() => Alert.alert('退出登陆', '', [
                {
                    text: '确定',
                    onPress: () => {
                        AsyncStorage.removeItem('token')
                        AsyncStorage.removeItem('tokenIn')
                        navigation.navigate('index')
                    }
                },
                {
                    text: '取消',
                    onPress: () => {
                    }
                },
            ])}>登出</Text>
        })
    })

    //搜索text内容
    function onStore(text) {
        setStore([])
        let arr = store
        _StoreQuery(text).then(cb => {
            // console.log('搜索收藏', cb)
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
    const [sound, setSound] = useState();
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
        }
    }

    //播放器更新
    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    return (
        <View style={[styles.Me,bColor(schemes)]}>
            <View style={styles.MeUse}>
                <TouchableHighlight
                    underlayColor={MsgColorTouchable(schemes)}
                    onPress={() => Alert.alert('替换头像', '', [
                        {
                            text: '换头像',
                            onPress: () => upAvatar(user.id).then(user=>setUser(user))
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
                                   style={[styles.upNameInput,MstText(schemes), MsgColor(schemes)]}
                                   defaultValue={user.name}
                                   onSubmitEditing={({nativeEvent: {text, eventCount, target}})=>Alert.alert(
                                       '昵称变动', '确认修改为:'+text, [
                                           {
                                               text: '确定',
                                               onPress: () => {
                                                   _Name(text).then(newUser=> setUser(newUser))
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
                        <Text style={[styles.T3, styles.bold, fColor(schemes)]}>{user.name} </Text>
                    </TouchableHighlight>}
                    <Text style={[styles.T5, fColor(schemes), styles.bold, {opacity: 0.9, marginTop: 6}]}>🆔 {user.id} </Text>
                </View>

                <Text style={[styles.T5, styles.bold, styles.vip, {borderWidth: 0}]}
                      onPress={() =>navigation.navigate('ticket')}>{memberFun(user.member)}</Text>
            </View>

            {/*搜索收藏*/}
            <View style={[styles.MeInput]}>
                <Text style={[MstText(schemes), styles.T5, styles.bold]}>🔍</Text>
                <TextInput style={[styles.MeInputs, styles.T5, MsgColor(schemes), MstText(schemes),{marginRight: 10}]}
                           placeholder={'搜索收藏夹'}
                           placeholderTextColor={placeholderColor(schemes)}
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
                    <View style={[styles.Words,bColor(schemes)]}>
                        {word.map((item,index)=><TouchableOpacity key={'wodr'+index}>
                            <Text style={[styles.T5,styles.bold,{marginTop:5,marginBottom:10},MstText(schemes)]} >{item.key} </Text>
                            {item.value.map((items,i)=> <View key={'wodrs'+i}>
                                <Text style={[styles.T5, MstText(schemes), {marginBottom:10,opacity: 0.8}]}>{items} </Text>
                            </View>)}
                            <View style={[BbC(schemes), styles.listBbC]}></View>
                        </TouchableOpacity>)}
                    </View>
                </View>
            </Modal>

            {/*收藏内容*/}
            {store.length?<FlatList
                data={store}
                refreshing={refresh}
                onRefresh={async () => {
                    setStore([...await _StoreLi()])
                    setRefresh(false)
                }}
                renderItem={({item, index}) => <View style={[styles.ImMsg, {marginLeft: 15}]}>
                    <Portrait w={32} h={32} r={7} url={item.user.avatar} t={item.user.emoji}/>
                    <StoreMsg data={item}
                               i={index}
                             on={on}
                             omWord={(cd)=>setWord(cd)}        //点击词典
                             onSound={(i,url)=>playSound(i,url)}
                             storeUp={async () => setStore([...await _StoreLi()])}/>
                </View>}
            />:
            <View style={{flex:1}}>
                <Text style={[styles.T5,styles.bold,{marginTop:5,textAlign: "center"},MstText(schemes)]}> 没有收藏 </Text>
            </View>}
            <Text style={[MstText(schemes),styles.T6, {textAlign:"center", marginBottom:20}]} > 内测版-0.0.1 </Text>
        </View>
    )
}


function StoreMsg(props) {
    const {data, storeUp,onSound,i,on,omWord} = props
    const schemes = useColorScheme();
    const window = useWindowDimensions();
    const [show, setShow] = useState(false) //操作键

    switch (data.tIm) {
        case 1:
            return <View style={[styles.msgRow]}>
                <View style={[{flexDirection: "row", alignItems: "center"}]}>
                    <TouchableOpacity style={[styles.msgText, {maxWidth: (0.6 * window.width)}, MsgColor(schemes)]}
                                      onPress={() =>data.url == 'null'?onSound(i,'null'): onSound(i,`${url}/${data.url}/`)} onLongPress={() => {
                        setShow(true)
                        setTimeout(() => {
                            setShow(false)
                        }, 3000)
                    }}>
                        <Text style={[styles.T5, MstText(schemes), styles.en, {opacity: 0.8}]}>{data.q}</Text>
                        <Text style={[styles.T6, MstText(schemes), styles.en, {opacity: 0.8}]}>{data.enQ}</Text>
                    </TouchableOpacity>
                    {i == on? <Text style={[styles.msgAudio, styles.T6]}> 🎵</Text>:''}
                </View>
                {show ? <View style={[styles.flot, MsgColor(schemes)]}>

                    {data.word.length?<TouchableOpacity onPress={()=>omWord(data.word)}>
                        <Text style={[MstText(schemes), styles.flotText]} > 词典 </Text>
                    </TouchableOpacity>:''}
                    {data.word.length? <View style={[styles.flotHx, lightNsgBcB(schemes)]}></View>:''}

                    <TouchableOpacity onPress={() =>_StoreDel(data._id).then(cb=>{
                        console.log('删除收藏',cb)
                        storeUp()
                        setShow(false)
                    })}>
                        <Text style={[styles.flotText, MstText(schemes)]} >删除 </Text>
                    </TouchableOpacity>
                    <View style={[styles.flotHx, lightNsgBcB(schemes)]}></View>
                    <TouchableOpacity onPress={async () => {
                        await Clipboard.setStringAsync(data.enQ)
                        setShow(false)
                    }}>
                        <Text style={[styles.flotText, MstText(schemes)]} >复制译文</Text>
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

