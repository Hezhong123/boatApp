import {Alert, FlatList, Text, TextInput, TouchableOpacity, useColorScheme, View} from "react-native";
import {bColor, fColor, MsgColor, MsgColorTouchable, MstText, placeholderColor, styles} from "../css";
import {_AddIm, _AddList, _DelIm, _Ims, _ListNull, _Query, _User} from "../utils/Api";
import {useCallback, useRef, useState} from "react";
import {Portrait} from "../components/Portrait";
import {useFocusEffect} from "@react-navigation/native";

export function Add({navigation}){
    const schemes = useColorScheme();
    const [queryList, setQueryList] = useState([])  //查询列表
    const [user, setUser] = useState({}) //用户信息
    const userRef = useRef(user)
    userRef.current = user
    const [nullList, setNullList] = useState([])   //非好友列表
    const [load, setLoad] = useState(false)  //下拉加载
    const [modals, setModals] = useState(false)  //状态栏

    //路由生命周期
    useFocusEffect(
        useCallback( () => {
            _User().then(user => setUser(user))
            _ListNull().then(cb=> setNullList([...cb ]))

            navigation.setOptions({
                title: "新的对话",
                headerRight: () => <Text style={[styles.T5, MstText(schemes), styles.bold,]}
                                         onPress={() => Alert.alert('创建群聊', '创建后，点击管理就能添加好友、', [
                                             {
                                                 text: '取消'
                                             },
                                             {
                                                 text: "创建",
                                                 onPress: () => _Ims(userRef.current.name + '的群聊').then(cb => {
                                                     navigation.navigate('im', {list: cb._id})
                                                 })
                                             }])}>➕群聊</Text>
            })

        },[])
    )

    return <View style={[styles.Add, bColor(schemes)]}>

        {/*搜索框*/}
        <View style={[styles.MeInput, {paddingTop: 5}]}>
            <Text style={[MstText(schemes), styles.T5, styles.bold]}>🔍</Text>
            <TextInput placeholder={'可通过id、昵称、电话查找朋友'}
                       placeholderTextColor={placeholderColor(schemes)}
                       returnKeyType={"search"}
                       style={[styles.MeInputs,MsgColor(schemes), MstText(schemes), styles.T5]}
                       onSubmitEditing={({nativeEvent: {text, eventCount, target}})=> _Query(text).then(cb=>{
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
                        <Text style={[styles.T4, fColor(schemes), styles.bold]}>{item.name} </Text>
                        <Text style={[styles.T5, fColor(schemes), styles.bold, {opacity: 0.6}]}>🆔 {item.id}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        console.log('打招呼', item)
                        _AddList(item._id).then(cb => {
                            if (cb.code) {
                                Alert.alert('添加好友', `${cb.msg}`, [
                                    {
                                        text: "ok",
                                        onPress: () => _ListNull().then(list => {
                                            console.log('非好友信道',list)
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
                        <Text style={[styles.T2, fColor(schemes), styles.bold, {marginRight: 20}]}>👋</Text>
                    </TouchableOpacity>
                </View>}
            />
        </View>

        {/*等待审核通过的联系人*/}
        <FlatList
            data={nullList}
            refreshing={load}
            onRefresh={(item) => _ListNull().then(list => {
                setNullList(list)
            })}
            renderItem={({item}) => user.id == item.user.id ? <View style={styles.ListRow}>
                <Portrait w={38} h={38} r={30} t={'😢'} url={item.userArr[1].avatar}/>
                <View style={[styles.ListLi]}>
                    <Text style={[styles.T4, fColor(schemes), styles.bold]}>{item.userArr[1].name}</Text>
                    {/*<Text style={[styles.T5, C2, styles.bold, {opacity: 0.6,marginTop: 3,}]}>🆔 {item.userArr[1].id}</Text>*/}
                    <Text style={[styles.T5, fColor(schemes), styles.bold, {opacity: 0.6, marginTop: 3,}]}>等待对方同意</Text>
                </View>
                <TouchableOpacity onPress={()=>Alert.alert("撤回添加好友请求", "", [{
                    text: "确定",
                    onPress: () =>  _DelIm(item._id).then(cb => {
                        _ListNull().then(list => {
                            setNullList([...list])
                        })
                    })
                }, {
                    text: "取消",
                    onPress: () => console.log("OK Pressed")
                }])}>
                    <Text style={{fontSize:20,marginRight:10}}> 🚫 </Text>
                </TouchableOpacity>

            </View> : <View style={styles.ListRow}>
                <Portrait w={38} h={38} r={30} t={'😢'} url={item.userArr[0].avatar}/>
                <View style={[styles.ListLi]}>
                    <Text style={[styles.T4, fColor(schemes), styles.bold]}>{item.userArr[0].name}</Text>
                    {/*<Text style={[styles.T5, C2, styles.bold, {opacity: 0.6,marginTop: 3}]}>🆔 {item.userArr[0].id}</Text>*/}
                    <Text style={[styles.T5, fColor(schemes), styles.bold, {opacity: 0.6, marginTop: 3}]}>通过邀请</Text>
                </View>

                <TouchableOpacity onPress={()=>Alert.alert("通过好友请求", "", [{
                    text: "取消", onPress: () => console.log("Ask me later pressed")
                }, {
                    text: "通过", style: 'cancel', onPress: () => _AddIm(item._id).then(cb => {
                        _ListNull().then(cb=>{
                            setNullList([...cb ])
                        })
                    })
                }])}>
                    <Text style={{fontSize:20,marginRight:10}}> ✅ </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>Alert.alert("删除添加好友请求", "", [{
                    text: "取消", onPress: () => console.log("Ask me later pressed")
                }, {
                    text: "删除",
                    style: "destructive",
                    onPress: () => _DelIm(item._id).then(cd=>{})
                }])}>
                    <Text style={{fontSize:20,marginRight:10}}> 🚫 </Text>
                </TouchableOpacity>

            </View>}


        />

    </View>
}
