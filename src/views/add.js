import {
    Alert,
    Button,
    FlatList, Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    useColorScheme, useWindowDimensions,
    View
} from "react-native";
import {Component, useEffect, useRef, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Portrait} from "../component/portrait";
import {Btn} from "../component/btn";
import {_AddIm, _AddList, _DelIm, _Ims, _ListNull, _Quser, _User} from "../_Api";


export function Add({navigation}) {

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const MeBbc = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC
    const placeholderColor =  colorScheme == 'light' ? '#222222' :'#ffffff'    //输入框

    const addRef = useRef(false)

    const [queryList, setQueryList] = useState([])  //查询列表
    const [user, setUser] = useState({}) //用户信息
    const userRef = useRef(user)
    userRef.current = user

    const [nullList, setNullList] = useState([])   //非好友列表
    const [load, setLoad] = useState(false)  //下拉加载
    const [modals, setModals] = useState(false)  //状态栏


    navigation.addListener('focus', () => {
        navigation.setOptions({
            title: "新的对话",
            headerRight:()=> <Text style={[styles.T5,MstText,styles.bold,]}
                                   onPress={()=>Alert.alert('创建群聊','创建后，点击管理就能添加好友、',[
                                       {
                                         text:'取消'
                                       },
                                       {
                                           text:"创建",
                                           onPress:()=>_Ims(userRef.current.name+'的群聊',cb=>{
                                               navigation.navigate('Im', {list: cb._id})
                                           })
                                       }
                                   ])}>➕群聊</Text>
            // headerRight: () => <Btn text={'👨‍👩‍👧‍👦'} fs={20} press={() =>  navigation.navigate('Adds')}/>
        })
        _User(cb=>{
            console.log('cb',cb)
            setUser(cb)
        })  //获取用户信息
        _ListNull(cb => {
            setNullList(cb)
        })    //获取非好友信道

    })

    const window = useWindowDimensions();
    return <View style={[styles.Add, C1]}>
        {/*搜索朋友*/}
        <View style={[styles.MeInput, {paddingTop: 5}]}>
            <Text style={[MstText, styles.T5, styles.bold]}>🔍</Text>
            <TextInput placeholder={'可通过id、昵称、电话查找朋友'}
                       placeholderTextColor={placeholderColor}
                       returnKeyType={"search"}
                       style={[styles.MeInputs, MsgColor, MstText, styles.T5]}
                       onSubmitEditing={({nativeEvent: {text, eventCount, target}})=> _Quser(text,cb=>{
                           if(cb.length){
                               setQueryList(cb)
                           }else {
                               Alert.alert('搜索结果','没找到你的朋友、')
                           }

                       })}
                       />
        </View>

        {/*搜索到朋友*/}
        <View>
            <FlatList
                data={queryList}
                renderItem={({item}) => <View style={styles.ListRow}>
                    <Portrait w={38} h={38} r={30} t={'😢'} url={item.avatar}/>
                    <View style={[styles.ListLi]}>
                        <Text style={[styles.T4, C2, styles.bold]}>{item.name} </Text>
                        <Text style={[styles.T5, C2, styles.bold, {opacity: 0.6}]}>🆔 {item.id}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        console.log('打招呼', item)
                        _AddList(item._id, cb => {
                            if (cb.code) {
                                Alert.alert('添加好友', `${cb.msg}`, [
                                    {
                                        text: "ok",
                                        onPress: () => _ListNull(list => {
                                            setNullList(list)
                                        })    //获取非好友信道
                                    }
                                ])
                            } else {
                                Alert.alert('添加好友', `${cb.msg}`, [
                                    {
                                        text: "ok"
                                    }
                                ])
                            }

                        })
                    }}>
                        <Text style={[styles.T2, C2, styles.bold, {marginRight: 20}]}>👋</Text>
                    </TouchableOpacity>
                </View>}
            />
        </View>

        {/*等待审核通过的联系人*/}
        <FlatList
            data={nullList}
            refreshing={load}
            onRefresh={(item) => _ListNull(list => {
                setNullList(list)
            })}
            renderItem={({item}) => user.id == item.user.id ? <View style={styles.ListRow}>
                <Portrait w={38} h={38} r={30} t={'😢'} url={item.userArr[1].avatar}/>
                <View style={[styles.ListLi]}>
                    <Text style={[styles.T4, C2, styles.bold]}>{item.userArr[1].name}</Text>
                    {/*<Text style={[styles.T5, C2, styles.bold, {opacity: 0.6,marginTop: 3,}]}>🆔 {item.userArr[1].id}</Text>*/}
                    <Text style={[styles.T5, C2, styles.bold, {opacity: 0.6, marginTop: 3,}]}>等待对方同意</Text>
                </View>
                <Btn text={'🚫'} fs={20} press={() => Alert.alert("撤回添加好友请求", "", [{
                    text: "取消", onPress: () => console.log("Ask me later pressed")
                }, {
                    text: "撤回",
                    style: "destructive",
                    onPress: () => console.log("OK Pressed")
                }])}/>

            </View> : <View style={styles.ListRow}>
                <Portrait w={38} h={38} r={30} t={'😢'} url={item.userArr[0].avatar}/>
                <View style={[styles.ListLi]}>
                    <Text style={[styles.T4, C2, styles.bold]}>{item.userArr[0].name}</Text>
                    {/*<Text style={[styles.T5, C2, styles.bold, {opacity: 0.6,marginTop: 3}]}>🆔 {item.userArr[0].id}</Text>*/}
                    <Text style={[styles.T5, C2, styles.bold, {opacity: 0.6, marginTop: 3}]}>通过邀请</Text>
                </View>
                <Btn text={'✅'} fs={20} press={() => Alert.alert("通过好友请求", "", [{
                    text: "取消", onPress: () => console.log("Ask me later pressed")
                }, {
                    text: "通过", style: 'cancel', onPress: () => _AddIm(item._id, cb => {
                        _ListNull(setNullList)
                    })
                }])}/>
                <Btn text={'🚫 '} fs={20} press={() => Alert.alert("删除添加好友请求", "", [{
                    text: "取消", onPress: () => console.log("Ask me later pressed")
                }, {
                    text: "删除",
                    style: "destructive",
                    onPress: () => _DelIm(item._id)
                }])}/>
            </View>}


        />

    </View>
}
