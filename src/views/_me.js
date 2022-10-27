import {
    Button,
    FlatList,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableHighlight,
    useColorScheme,
    View
} from "react-native";
import {styles} from "../../css";
import React, {useEffect, useState} from "react";
import {MsgImg} from "./_im";
import {Avatar} from "../component/Avatar";
import {_User} from "../model/_user";


export function _me({navigation}){
    const theme = useColorScheme();
    const themeStyles =theme == 'dark'?styles.dark:styles.light
    const themeT1 = theme == 'dark' ? styles.darkT1 : styles.lightT1
    const themeT2 = theme == 'dark' ? styles.darkT2 : styles.lightT2
    const lightInput = theme == 'dark' ? styles.darkInput : styles.lightInput
    const themeHx = theme == 'dark' ? styles.darkHx : styles.lightHx
    const textLogin = theme == 'dark' ? styles.darkLogin : styles.lightLogin

    const [user,setUser] = useState({})
    const [load, setLoad] = useState(false)

    useEffect(()=>{
        console.log('进入我的')
        _User.then(user=>{
            console.log('用户信息',user)
            setUser(user)
        })
        return ()=>{
            console.log('退出我的')
        }
    },[])


    function upData() {
        console.log(22323)
        setLoad(true)
        setTimeout(()=>{
            setLoad(false)
        },800)
    }

    return <View style={[styles.container,themeStyles]}>
        {/*个人信息*/}
        <TouchableHighlight onPress={()=>navigation.navigate('UpMe')} >
           <View style={[styles.Me,themeStyles]}>
               <Avatar {...{w:60,h:60,r:5,num:0,vip:false,avatar:user.avatar}}/>
               <View style={[{paddingLeft: 10}]}>
                   <Text style={[themeT1,styles.MeT1]}>{user.name} </Text>
                   <Text style={[themeT2,styles.MeT2]}>🆔 {user.id}</Text>
               </View>
           </View>
        </TouchableHighlight>

        {/*收藏标签*/}
        <View style={[styles.MeTab]}>
            <Text style={styles.MeTabT1}>收藏夹 🔍</Text>
            <TextInput style={[styles.MeInput,textLogin]} />
        </View>

        {/*收藏内容*/}
        <FlatList
            data={data}
            style={[styles.MeMsg]}
            refreshing={load}
            onRefresh={upData}
            renderItem={()=><View style={[styles.MsgRow,styles.MeMsgItem]}>
                <View style={[styles.MsgBo]}>
                    <Text style={[styles.MsgBoText]}>🗑</Text>
                </View>
                <View style={[styles.MsgText,lightInput]}>
                    <Text style={[themeT1,styles.MsgT1]}>你好世界</Text>
                    <View style={[styles.hx,themeHx]}></View>
                    <Text style={[themeT2,styles.MsgT2]}>HELLO WORLD</Text>
                </View>
                <View style={[styles.MsgBo]}>
                    <Text style={[styles.MsgBoText]}>🎵</Text>
                </View>
            </View>}
        />
        {/*<ScrollView style={[styles.MeMsg]}>*/}
        {/*    {[1,2,3,4,5,6,7,8,9,10].map((item,i)=>*/}
        {/*        )}*/}
        {/*</ScrollView>*/}

    </View>
}


function renderItem(i){
    return <Text style={[i==2?styles.MeTabIconOne:styles.MeTabIcon]} >收藏</Text>
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
