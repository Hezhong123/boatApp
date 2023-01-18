import {Alert, Text, TextInput, TouchableOpacity, useColorScheme, View} from "react-native";
import {BbC, bColor, fColor, inputBorderColor, styles} from "../css";
import {useRef, useState} from "react";
import {_Sms, _SmsLogin} from "../utils/Api";
export function Login({navigation}) {
    const schemes = useColorScheme();

    navigation.addListener('focus', () => {
        navigation.setOptions({
            headerShown: false,
        })
    })

    const [m, setM] = useState(0)   //验证码计时器
    const refM = useRef(m)
    refM.current = m


    const [end, setEnd] = useState(true)   //获取验证码
    const [tel, setTel] = useState(Number)   //电话
    const [code, setCode] = useState(null) //短信验证码
    const [codeBoolean, setCodeBoolean] = useState(false) //登陆严重状态


    //计时器
    const mFun = () => {
        setM(60)
        let intM = setInterval(() => {
            if (refM.current == 1) {
                clearInterval(intM)
                setEnd(false)
            }
            setM(refM.current - 1)
        }, 1000)
    }

    return (
        <View style={[styles.Login, bColor(schemes)]}>
            <Text
                style={[styles.T1, styles.bold, fColor(schemes), {marginBottom: 10}, {color: '#6A8DE2'}]}>电话登录 </Text>
            <Text style={[styles.T5, fColor(schemes), {opacity: 0.9}, styles.bold]}>使用前请阅读 <Text
                style={styles.LoginRowColor}>《boatIM使用协议》</Text>，注册或使用代表您同意此协议。 </Text>

            <View style={{width: '60%', marginTop: 30}}>
                <Text style={[styles.T5, fColor(schemes), styles.bold, {opacity: 0.9}]}><Text
                    style={styles.LoginRed}>* </Text>输入电话号码</Text>
                <TextInput
                    defaultValue={tel}
                    editable={end}
                    keyboardType={'numeric'}
                    style={[fColor(schemes), styles.LoginInputs, inputBorderColor(schemes), styles.T5, {marginBottom: 6}]}
                    value={tel}
                    returnKeyType={"done"}
                    onSubmitEditing={({nativeEvent: {text, eventCount, target}}) => {
                        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                        if (myreg.test(text)) {
                            mFun()      //计时器起
                            setCodeBoolean(true)

                        } else {
                            Alert.alert('号码错误', '输入的电话格式不对')
                        }
                    }}
                    onChangeText={text => setTel(text)}/>
            </View>

            {codeBoolean?<View style={{width: '40%', marginTop: 20}}>
                <Text style={[styles.T5, fColor(schemes), styles.bold, {opacity: 0.9}]}><Text style={styles.LoginRed}>* </Text>输入短信验证码</Text>
                <TextInput style={[fColor(schemes), styles.LoginInputs, inputBorderColor(schemes), styles.T5, {marginBottom: 6}]}
                           keyboardType={'numeric'}
                           value={code}
                           onChangeText={(text)=>setCode(text)}/>

                <View>
                    {m?<Text style={[styles.T6, fColor(schemes), styles.bold,styles.LoginYe]}>{m}秒</Text>:
                        <TouchableOpacity onPress={() =>{
                            setCodeBoolean(true)
                            mFun()
                        }}>
                            <Text style={[styles.T6, fColor(schemes), styles.bold]}>重新获取 </Text>
                        </TouchableOpacity>}
                </View>
            </View>:''}

            {/*短信登陆*/}
            {codeBoolean?<TouchableOpacity onPress={() => {
                _SmsLogin(tel,code).then( cb=> {
                    console.log('登陆信息', cb)
                    if (cb == '请核对验证码') {
                        Alert.alert(cb)
                    } else {
                        navigation.navigate('index')
                    }
                })
            }}>
                <Text style={styles.loginBtn}>登  陆</Text>
            </TouchableOpacity>:''}


        </View>
    )
}
