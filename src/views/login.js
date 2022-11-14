import {Button, Text, TextInput, TouchableHighlight, useColorScheme, View} from "react-native";
import {useEffect, useState} from "react";
import {styles} from "../css";
import {_Login} from "../Api";



export function Login({navigation}){
    const [tel,setTel] = useState(Number)

    useEffect(()=>{
        navigation.setOptions({
            headerShown:false,
        })

        return ()=>{
            console.log('2222')
        }
    },[])

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? {color:'#696A80'} : styles.darkC2
    const Bbc = colorScheme == 'light' ? {borderColor:'#696A80'} : {borderColor:'#fff'}    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框

    return <View style={[styles.Login,C1]}>
        <View style={[styles.LoginRow]}>
            <Text style={[styles.T1,styles.bold,C2,{marginBottom:10},{color: '#6A8DE2'}]}>短信登录 </Text>
            <Text style={[styles.T5,C2,{opacity:0.9},styles.bold]}>使用前请阅读 <Text style={styles.LoginRowColor}>《氢语im使用协议》</Text>，注册或使用代表您同意此协议。 </Text>

            <View style={{width:'60%',marginTop:30}}>
                <Text style={[styles.T5,C2,styles.bold,{opacity:0.9}]}><Text style={styles.LoginRed}>* </Text>电话号码</Text>
                <TextInput  style={[C2,styles.LoginInputs,Bbc,styles.T5,{marginBottom:6}]} value={tel} onChangeText={text=>setTel(text)} />
                <TouchableHighlight underlayColor={MsgColorTouchable}  onPress={ ()=>{
                    console.log('登录',tel)
                    _Login(tel, cb => {
                        console.log(cb)
                    })
                }} >
                    <Text style={[styles.T6,C2,styles.bold]}>重新获取 <Text style={styles.LoginYe}>38秒</Text></Text>
                </TouchableHighlight>
            </View>



            <View style={{width:'30%',marginTop:20}}>
                <Text style={[styles.T5,C2,styles.bold,{opacity:0.9}]}><Text style={styles.LoginRed}>* </Text>输入验证码</Text>
                <TextInput  style={[C2,styles.LoginInputs,Bbc,styles.T5,{marginBottom:6}]} />
                <TouchableHighlight underlayColor={MsgColorTouchable}  onPress={()=>{
                    console.log('登录')
                }} >
                    <Text style={[styles.T6,C2,styles.bold]}><Text style={styles.LoginYe}>*</Text> 验证码错误</Text>
                </TouchableHighlight>
            </View>

        </View>
    </View>
}
