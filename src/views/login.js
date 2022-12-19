import {Alert, Button, Text, TextInput, TouchableHighlight, TouchableOpacity, useColorScheme, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import {styles} from "../css";
import {_Login} from "../_Api";


export function Login({navigation}) {
    navigation.addListener('focus', () => {
        navigation.setOptions({
            headerShown: false,
        })
        console.log('进入登陆')
    })
    navigation.addListener('blur', () => {
        console.log('退出登陆')
    })

    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const C2 = colorScheme == 'light' ? {color: '#696A80'} : styles.darkC2
    const Bbc = colorScheme == 'light' ? {borderColor: '#696A80'} : {borderColor: '#fff'}    //对话框颜色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框

    const [m, setM] = useState(0)   //验证码计时器
    const refM = useRef(m)
    refM.current = m

    const [end,setEnd] = useState(true)   //获取验证码
    const [tel,setTel] = useState(Number)   //电话
    const [code,setCode] = useState(0) //验证码
    const [codeB,setCodeB] = useState(false) //验证码


    //计时器
    const mFun = () => {
        setM(10)
        let intM = setInterval(() => {
            if (refM.current == 1) {
                clearInterval(intM)
                setEnd(false)
            }
            setM(refM.current - 1)
        }, 1000)
    }

    return <View style={[styles.Login, C1]}>
        <View style={[styles.LoginRow]}>
            <Text style={[styles.T1, styles.bold, C2, {marginBottom: 10}, {color: '#6A8DE2'}]}>邮件登录 </Text>
            <Text style={[styles.T5, C2, {opacity: 0.9}, styles.bold]}>使用前请阅读 <Text
                style={styles.LoginRowColor}>《boatIM使用协议》</Text>，注册或使用代表您同意此协议。 </Text>

            <View style={{width: '60%', marginTop: 30}}>
                <Text style={[styles.T5, C2, styles.bold, {opacity: 0.9}]}><Text style={styles.LoginRed}>* </Text>输入邮箱</Text>
                <TextInput
                    defaultValue={tel}
                    editable={end}
                    keyboardType={'number-pad'}
                    style={[C2, styles.LoginInputs, Bbc, styles.T5, {marginBottom: 6}]} value={tel}
                    returnKeyType={"done"}
                    onChange={(t)=>setTel(t)}
                    onSubmitEditing={({nativeEvent: {text, eventCount, target}}) => {
                        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                        if (myreg.test(text)) {
                            mFun()
                            setTel(text)
                            setCodeB(true)      //验证码
                            setEnd(false)   //不可输入
                        } else {
                            Alert.alert('号码错误', '输入的电话格式不对')
                        }
                    }}
                    onChangeText={text => setTel(text)}/>
            </View>

            {codeB?<View style={{width: '30%', marginTop: 20}}>
                <Text style={[styles.T5, C2, styles.bold, {opacity: 0.9}]}><Text style={styles.LoginRed}>* </Text>输入验证码</Text>
                <TextInput style={[C2, styles.LoginInputs, Bbc, styles.T5, {marginBottom: 6}]}
                           defaultValue={code}
                           keyboardType={'number-pad'}
                           returnKeyType={"done"}
                           onChange={(t)=>setCode(t)}
                           onSubmitEditing={({nativeEvent: {text, eventCount, target}}) => {
                               let arg = /^\d{6}$/
                               if (arg.test(text)) {
                                   console.log('验证码', text)
                                   setCode(text)
                               } else {
                                   Alert.alert('输入错误')
                               }

                           }}/>
                <View>
                    {m?<Text style={[styles.T6, C2, styles.bold,styles.LoginYe]}>{m}秒</Text>:
                        <TouchableOpacity onPress={() => mFun()}>
                            <Text style={[styles.T6, C2, styles.bold]}>重新获取 </Text>
                        </TouchableOpacity>}
                </View>
            </View>:''}


            {code.length==6?<TouchableOpacity onPress={() => _Login(tel,cb=>{
                console.log('登陆信息',cb)
                navigation.navigate('List')
            })}>
                <Text style={styles.loginBtn}>使 用</Text>
            </TouchableOpacity>:''}


        </View>
    </View>
}
