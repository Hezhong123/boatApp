// 创建群聊

import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import {Btn} from "../component/btn";
import * as React from "react";
import {styles} from "../css";
import {Portrait} from "../component/portrait";
import {useRef, useState} from "react";
import {_AddIms, _Contact, _ListId, _OutIms, _QuitIms, _User} from "../_Api";

export const Adds = ({route,navigation}) => {
    const colorScheme = useColorScheme();
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const BbC = colorScheme == 'light' ? styles.lightBbC : styles.darkBbC
    const C2 = colorScheme == 'light' ? styles.lightC2 : styles.darkC2
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const placeholderColor =  colorScheme == 'light' ? '#222222' :'#ffffff'    //输入框

    const [user, setUser] = useState([]) //群成员
    const [imUser, setImUser] = useState('') //群主Id
    const [users, setUsers] = useState([]) //群成员
    const [title, setTitle] = useState('')  //群昵称
    const [news,setNews] = useState([])   //最近联系人


    const {list} = route.params;
    navigation.addListener('focus', () => {
        _User(user => {
            console.log('用户信息', user,list)
            _ListId(list,cb=>{
                console.log('信道',cb)
                setUser(user)
                setUsers(cb.userArr)
                setImUser(cb.user)
                setTitle(cb.imTitle)
                if(cb.user==user._id){
                    navigation.setOptions({
                        title: "管理",
                        headerRight: () => <Text style={[styles.T5,MstText,styles.bold,styles.red]} onPress={
                            ()=>Alert.alert('解散群会话','',[
                                {
                                    text:'确定',
                                    onPress:()=>_OutIms(list,cb=>{
                                        navigation.navigate('List')
                                    })
                                },
                                {
                                    text:'取消'
                                }
                            ])
                        }>解散</Text>
                    })
                }else {
                    navigation.setOptions({
                        title: "退出",
                        headerRight: () => <Text style={[styles.T5,MstText,styles.bold,styles.red]} onPress={
                            ()=>Alert.alert('退出群聊','',[
                                {
                                    text:'退出',
                                    onPress:()=>_QuitIms(list,user._id,cd=>{
                                        navigation.navigate('List')
                                    })
                                },
                                {
                                    text:'取消'
                                }
                            ])}>退出</Text>
                    })
                }
            })
            //最近联系人
            _Contact(arr=>{
                console.log('最近联系人',arr)
                setNews(arr)
            })
        })
    })

    //最近联系人更新
    const upUsers = (users,user)=>{
        console.log('1111',)
        let on = ''
        users.map((item,i)=>{
            if(user._id == item._id){
                on = true
            }
        })
        return on
    }

    return <SafeAreaView style={[styles.imQ,C1]}>
        {imUser==user._id?<View style={[styles.addRow]}>
            <Text style={[styles.T5, MstText, styles.bold, {letterSpacing: 1}]}>群名称: </Text>
            <View style={styles.addInouts}>
                <TextInput defaultValue={title}
                           placeholderTextColor={placeholderColor}
                           returnKeyType={"done"} style={[styles.addInput, MsgColor, MstText, styles.T5]}
                           onSubmitEditing={({nativeEvent: {text, eventCount, target}})=>Alert.alert(
                               '修改群名称','将群名称修改为:'+text,
                               [
                                   {
                                       'text':'确定'
                                   },
                                   {
                                       'text':'取消'
                                   }
                               ]
                           )}/>
                {/*<Text style={[styles.T5,MstText,styles.bold]} onPress={()=>{*/}
                {/*    console.log('修改昵称')*/}
                {/*}} >修改</Text>*/}
            </View>
        </View>:''}

        <View style={[BbC, styles.listBbC]}></View>

        {/*编辑群成员*/}
        <View style={[styles.addRow]}>
            <Text
                style={[styles.T5, MstText, styles.bold, {letterSpacing: 1}]}>群成员:</Text>
            <Text style={[styles.T5, MstText, styles.bold, {letterSpacing: 3}]}>{users.length}/50</Text>
            {/*<View style={{flexDirection: 'row'}}>*/}
            {/*    <Btn text={'➖'} fs={12} press={() => {*/}
            {/*    }}/>*/}
            {/*    <Btn text={'➕'} fs={12} press={() =>{}}/>*/}
            {/*</View>*/}
        </View>

        {/*群成员*/}
        <View style={styles.AddImg}>
            {users.map((item, index) =>
                <TouchableOpacity
                    onLongPress={() => imUser==user._id?Alert.alert('移除群聊', '', [
                        {
                            text: '确定',
                            onPress:()=>{
                                if(item._id == user._id){
                                    Alert.alert('错误操作','你可以点击解散群',[{text:'ok'}])
                                }else {
                                    _QuitIms(list,item._id,cb=>{
                                        console.log('移除群聊',cb)
                                        _ListId(list,im=>{
                                            setUsers(im.userArr)
                                        })
                                    })
                                }

                            }
                        },
                        {
                            text: '取消'
                        }
                    ]):Alert.alert('移出群聊','群主才有开人的权利',[
                        {
                            text:'ok'
                        }
                    ])}
                    key={'add' + index}
                    style={styles.addIm}>
                    <Portrait w={30} h={30} r={5} t={item.emoji} url={item.avatar}/>
                    <Text numberOfLines={2}
                          style={[styles.T6, MstText, {marginTop: 5, fontSize:10,letterSpacing: 1}]}>{item.name}</Text>
                </TouchableOpacity>)}
        </View>
        {/*搜索添加好友*/}
        <View style={{flex:1}}>
            {/*<View style={[BbC, styles.listBbC]}></View>*/}
            <View style={[styles.addRow]}>
                <Text style={[styles.T5, MstText, styles.bold]}>🔍</Text>
                <TextInput placeholder={'可通过id、昵称、电话查找朋友'}
                           placeholderTextColor={placeholderColor}
                           returnKeyType={"search"}
                           style={[styles.addInput, MsgColor, MstText, styles.T5]}
                           onSubmitEditing={({nativeEvent: {text, eventCount, target}})=>{
                               console.log('搜索加群用户',text)
                           }}/>
                {/*<Text style={[styles.T5,MstText,{marginLeft:5}]} onPress={()=>{}}>搜索</Text>*/}
                {/*<Btn text={'搜索'} fs={13} press={() => {*/}
                {/*}}/>*/}
            </View>
            {news.length?<FlatList
                data={news}
                ItemSeparatorComponent={() => <View style={[BbC, styles.listBbC]}></View>}
                renderItem={({item,index})=> <TouchableOpacity
                    onPress={()=>Alert.alert('添加群聊',`将${item.name}加入群聊`,[
                        {
                            text:'取消',
                        },{
                            text:'添加',
                            onPress:()=>_AddIms(list,item._id,cb=>{
                                console.log('加入群聊',cb)
                                _ListId(list,im=>{
                                    setUsers(im.userArr)
                                })
                            })
                        }
                    ])}
                >
                    {upUsers(users,item)?'':<View style={[styles.ListRow]}>
                        <Portrait w={30} h={30} r={5} t={item.emoji} url={item.avatar} />
                        <View style={[styles.ListLi]}>
                            <Text style={[styles.T6, C2, styles.bold]}>{item.name}</Text>
                            <Text style={[styles.T6, C2, styles.bold, {opacity: 0.6, marginTop: 3,}]}>🆔{item.id}</Text>
                        </View>
                        <Btn text={'✅'} fs={13} />
                    </View>}
                </TouchableOpacity>}
            />:''}


        </View>
    </SafeAreaView>
}

