import {Alert, FlatList, Text, TextInput, TouchableOpacity, useColorScheme, View} from "react-native";
import {bColor, fColor, MsgColor, MstText, placeholderColor, styles} from "../css";
import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useRef, useState} from "react";
import {
    _AddIms,
    _AddList,
    _Contact,
    _ListId,
    _ListNull,
    _NameIms,
    _OutIms, _Query,
    _QuitIms,
    _Quser,
    _User
} from "../utils/Api";
import {Portrait} from "../components/Portrait";

export function Adds({route, navigation}) {
    const schemes = useColorScheme();
    const {list} = route.params;

    const [user, setUser] = useState({}) //用户信息
    const userRef = useRef(user)
    userRef.current = user
    const [imUser, setImUser] = useState('') //群主Id
    const [users, setUsers] = useState([]) //群成员
    const [title, setTitle] = useState('')  //群昵称
    const [news, setNews] = useState([])   //最近联系人


    useFocusEffect(
        useCallback(() => {
            //用户信息
            _User().then(user => setUser(user))
            //权限
            _ListId(list).then(cb => {
                setUsers(cb.userArr)
                setImUser(cb.user)
                setTitle(cb.imTitle)
                if (cb.user == userRef.current._id) {
                    navigation.setOptions({
                        title: "管理",
                        headerRight: () => <Text style={[styles.T5, MstText(schemes), styles.bold, styles.red]}
                                                 onPress={
                                                     () => Alert.alert('解散群会话', '', [
                                                         {
                                                             text: '确定',
                                                             onPress: () => _OutIms(list).then(cb => {
                                                                 navigation.navigate('index')
                                                             })
                                                         },

                                                         {
                                                             text: '取消'
                                                         }
                                                     ])
                                                 }>解散</Text>
                    })
                } else {
                    navigation.setOptions({
                        title: "退出",
                        headerRight: () => <Text style={[styles.T5, MstText(schemes), styles.bold, styles.red]}
                                                 onPress={
                                                     () => Alert.alert('退出群聊', '', [
                                                         {
                                                             text: '退出',
                                                             onPress: () => _QuitIms(list, userRef.current._id).then(cb => navigation.navigate('index'))
                                                         },
                                                         {
                                                             text: '取消'
                                                         }
                                                     ])}>退出</Text>
                    })
                }
            })

            //最近联系人
            _Contact().then(arr => {
                console.log('最近联系人', arr)
                setNews(arr)
            })


        }, []))

    //最近联系人更新
    const upUsers = (users, user) => {
        let on = ''
        users.map((item, i) => {
            if (user._id == item._id) {
                on = true
            }
        })
        return on
    }

    return (
        <View style={[styles.imQ, bColor(schemes)]}>
            {imUser == user._id ? <View style={[styles.addRow]}>
                <Text style={[styles.T5, MstText(schemes), styles.bold, {letterSpacing: 1}]}>群名称: </Text>
                <View style={styles.addInouts}>
                    <TextInput defaultValue={title}
                               placeholderTextColor={placeholderColor(schemes)}
                               returnKeyType={"done"}
                               style={[styles.addInput, MsgColor(schemes), MstText(schemes), styles.T5]}
                               onSubmitEditing={({nativeEvent: {text, eventCount, target}}) => Alert.alert(
                                   '修改群名称', '将群名称修改为:' + text,
                                   [
                                       {
                                           'text': '确定',
                                           onPress: () => _NameIms(list, text).then(cb => {
                                               Alert.alert('修改成功')
                                           })
                                       },
                                       {
                                           'text': '取消'
                                       }
                                   ]
                               )}/>
                    {/*<Text style={[styles.T5,MstText,styles.bold]} onPress={()=>{*/}
                    {/*    console.log('修改昵称')*/}
                    {/*}} >修改</Text>*/}
                </View>
            </View> : ''}

            <View style={[bColor(schemes), styles.listBbC]}></View>

            {/*编辑群成员*/}
            <View style={[styles.addRow]}>
                <Text
                    style={[styles.T5, MstText(schemes), styles.bold, {letterSpacing: 1}]}>群成员:</Text>
                <Text style={[styles.T5, MstText(schemes), styles.bold, {letterSpacing: 3}]}>{users.length}/50</Text>
            </View>

            {/*群成员*/}
            <View style={styles.AddImg}>
                {users.map((item, index) =>
                    <TouchableOpacity
                        onLongPress={() => imUser == user._id ? Alert.alert('移除群聊', '', [
                            {
                                text: '确定',
                                onPress: () => {
                                    if (item._id == user._id) {
                                        Alert.alert('错误操作', '你可以点击解散群', [{text: 'ok'}])
                                    } else {
                                        _QuitIms(list, item._id).then(cb => {
                                            console.log('移除群聊', cb)
                                            _ListId(list).then(cb => {
                                                setUsers(cb.userArr)
                                            })
                                        })
                                    }

                                }
                            },
                            {
                                text: '取消'
                            }
                        ]) : Alert.alert('移出群聊', '群主才有开人的权利', [
                            {
                                text: 'ok'
                            }
                        ])}
                        key={'add' + index}
                        style={styles.addIm}>
                        <Portrait w={30} h={30} r={5} t={item.emoji} url={item.avatar}/>
                        <Text numberOfLines={2}
                              style={[styles.T6, MstText(schemes), {
                                  marginTop: 5,
                                  fontSize: 10,
                                  letterSpacing: 1
                              }]}>{item.name}</Text>
                    </TouchableOpacity>)}
            </View>

            {/*搜索添加好友*/}
            <View style={{flex: 1}}>
                {/*<View style={[BbC, styles.listBbC]}></View>*/}
                <View style={[styles.addRow]}>
                    <Text style={[styles.T5, MstText(schemes), styles.bold]}>🔍</Text>
                    <TextInput placeholder={'可通过id、昵称、电话查找朋友'}
                               placeholderTextColor={placeholderColor(schemes)}
                               returnKeyType={"search"}
                               style={[styles.addInput, fColor(schemes), MsgColor(schemes), MstText(schemes), styles.T5]}
                               onSubmitEditing={async ({
                                                           nativeEvent: {
                                                               text,
                                                               eventCount,
                                                               target
                                                           }
                                                       }) => await _Query(text).then(cb => {
                                   if (cb.length) {
                                       console.log('搜索内容', cb)
                                       setNews(cb)
                                   } else {
                                       Alert.alert('搜索结果', '没找到你的朋友、')
                                   }

                               })}/>
                </View>
                {news.length ? <FlatList
                    data={news}
                    ItemSeparatorComponent={() => <View style={[bColor(schemes), styles.listBbC]}></View>}
                    renderItem={({item, index}) => <TouchableOpacity
                        onPress={() => Alert.alert('添加群聊', `将${item.name}加入群聊`, [
                            {
                                text: '取消',
                            }, {
                                text: '添加',
                                onPress: () => _AddIms(list, item._id).then(cb => {
                                    _ListId(list).then(cb => setUsers(cb.userArr))
                                })
                            }
                        ])}
                    >
                        {upUsers(users, item) ? '' : <View style={[styles.ListRow]}>
                            <Portrait w={30} h={30} r={5} t={item.emoji} url={item.avatar}/>
                            <View style={[styles.ListLi]}>
                                <Text style={[styles.T6, fColor(schemes), styles.bold]}>{item.name}</Text>
                                <Text style={[styles.T6, fColor(schemes), styles.bold, {
                                    opacity: 0.8,
                                    marginTop: 3,
                                }]}>🆔{item.id}</Text>
                            </View>
                            <Text style={[styles.T2, fColor(schemes), styles.bold, {marginRight: 16}]}>✅</Text>
                        </View>}
                    </TouchableOpacity>}
                /> : ''}


            </View>

        </View>
    )
}
