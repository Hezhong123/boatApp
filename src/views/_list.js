import {
    Alert,
    Button,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text, TouchableHighlight,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import {styles} from "../../css";
import {useEffect, useRef, useState} from "react";
import {Avatar} from "../component/Avatar";
import {Btn} from "../set";
import {getToken, getTokenExp} from "../utils/token";
import {_listLI} from "../model/_list";
import io from "socket.io-client";
import {_User} from "../model/_user";
import exponentAVWeb from "expo-av/src/ExponentAV.web";

const socket = io('ws://127.0.0.1:3000',);

export function _list({route, navigation}) {

    const theme = useColorScheme();
    const themeStyles = theme == 'dark' ? styles.dark : styles.light
    const themeT1 = theme == 'dark' ? styles.darkT1 : styles.lightT1
    const themeT2 = theme == 'dark' ? styles.darkT2 : styles.lightT2
    const themeHx = theme == 'dark' ? styles.darkHx : styles.lightHx

    const firstRenderRef = useRef(true);

    const [list, setList] = useState(Array) //对话列表


    useEffect(()=>{
        if(firstRenderRef.current){
            //检测登陆是否过期
            getTokenExp(cb=>{
                console.log('expiresIn', cb)
                if(cb>parseInt(new Date().getTime()/1000)){
                    _User.then(user=>{
                        console.log('用户信息',user)
                        socket.on('connection', (a1) => {
                            socket.on('im', e => {
                                console.log('Io', e)
                            })
                        })
                        socket.on(user._id, e => {
                            console.log('收到信息',e)
                        })
                    })

                    _listLI.then(list=>{
                        console.log('信道列表',list)
                        setList(list)
                    })
                }else {
                    Alert.alert("未登陆",'请前往短信登陆页面',[ {
                        text: "确定",
                        onPress: () => navigation.navigate('Login'),
                        style: "default",
                    }])
                }
            })


            //设置标题
            navigation.setOptions({
                headerLeft: () => <Btn title={'➕*'} cb={(e)=>navigation.navigate("Add")} />,

                headerRight: () => ( <Btn title={'😯'} cb={(e)=>navigation.navigate("Me")} />),
            })

        }
        return ()=>{
           setTimeout(()=>{
               console.log('退出联系人列表')
           },100)
        }

    },[])

    return <View style={[styles.container,themeStyles]}>

        <Button title={'登陆'} onPress={()=>navigation.navigate('Login')} />

        <FlatList
            data={list}
            ItemSeparatorComponent={() => (<View style={[themeHx,styles.hx]}></View>)}
            renderItem={({item}) => <TouchableHighlight onPress={() =>
                navigation.navigate("Im", {name: 'hez', id: 23232})} >
                <View style={[styles.listView,themeStyles]}>

                    <Avatar {...{w:46,h:46,r:5,num:3,vip:true}}/>
                    <View style={styles.ListRow}>
                        <Text style={[themeT1,styles.listT1]}>name</Text>
                        <Text style={[themeT2,styles.listT2]}>未度消息  </Text>
                    </View>

                    <Text style={styles.listT3}> 3 分钟</Text>

                </View>
            </TouchableHighlight> }
        />
    </View>

}




