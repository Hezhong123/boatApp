import {
    Button,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableHighlight,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import {Component, useEffect, useState} from "react";
import * as React from "react";
import {styles} from "../css";
import {Portrait} from "../component/Portrait";
import {Btn} from "../component/btn";

export function Im({navigation}) {
    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    return <SafeAreaView style={[C1, styles.Im]}>

        <ScrollView>
            <View style={styles.ImMsg}>
                <Portrait w={32} h={32} r={7} t={'😢'}/>
                <LeftMsg type={1}/>
            </View>
            <View style={styles.ImMsg}>
                <Portrait w={32} h={32} r={7} t={'😢'}/>
                <LeftMsg type={3}/>
            </View>
            <Text style={[styles.MsgTime]}> 3分钟 </Text>
            <View style={styles.ImMsg}>
                <Portrait w={32} h={32} r={7} t={'😢'}/>
                <LeftMsg type={2}/>
            </View>

            <RightMsg type={1}/>
            <RightMsg type={2}/>
            <RightMsg type={3}/>
            <View style={styles.ImMsg}>
                <Portrait w={32} h={32} r={7} t={'😢'}/>
                <LeftMsg type={1}/>
            </View>
            <Text style={[styles.MsgTime]}> 3分钟 </Text>

            <View style={{height:80}}></View>
        </ScrollView>

        {/*发送信息*/}
        <View style={[styles.imSend]}>
            {/*操作列表*/}
            <View style={styles.imFun}>
                <Btn text={'✍️'} fs={16} press={()=>{}}  />
                <Btn text={'🎧️️'} fs={16} press={()=>{}} />
            </View>

            {/*词列*/}
            <View style={styles.imWord}>
                <Text style={styles.imWords}> hello </Text>
                <Text style={styles.imWords}> hello </Text>
            </View>



            {/*发送消息*/}
            <View style={[styles.imInput,C1]}>
                <Btn text={'📷️'}  fs={20} press={()=>{}} />
                <TextInput style={[styles.imInputSend,styles.T5,MsgColor,MstText]}
                           multiline={true}/>
                <Btn text={'💬️'} fs={20} press={()=>{}} />
            </View>
        </View>

        {/*<Text> 发送对话页面 </Text>*/}
    </SafeAreaView>
}





// 右边信息
function LeftMsg(props) {
    const {type} = props
    const colorScheme = useColorScheme();
    const MsgColor = colorScheme == 'light' ? styles.lightMsg : styles.darkMsg  //对话框配色
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    const MstText = colorScheme == 'light' ? {color: '#222222'} : {color: '#ffffff'}    //对话框颜色
    const lightNsgBcB = colorScheme == 'light' ? styles.lightNsgBcB : styles.darkNsgBcB    //对话框分割线

    switch (type) {
        case 1:
            return <View style={[styles.msgRow]}>
                <View style={[styles.msgText, MsgColor]}>
                    <TouchableHighlight activeOpacity={0.3}
                                        underlayColor={MsgColorTouchable}
                                        onPress={() => console.log('111')}>
                        <Text style={[styles.T5, styles.zh, MstText, lightNsgBcB]}> 你好世界</Text>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable} onPress={() => {
                    }}>
                        <Text style={[styles.T6, MstText, styles.en, {opacity: 0.8}]}> hello， worid</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight activeOpacity={0.3} underlayColor={MsgColorTouchable}>
                    <Text style={[styles.msgAudio, styles.T5]}> 🎵</Text>
                </TouchableHighlight>
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

// 左边信息
function RightMsg(props) {
    const {type} = props
    const colorScheme = useColorScheme();
    const MsgColorTouchable = colorScheme == 'light' ? '#EAEAEA' : '#333C52'    //点击对话框
    switch (type) {
        case 1:
            return <View style={[styles.msgRowRight]}>
                <TouchableHighlight>
                    <Text style={[styles.msgAudio, styles.T5]}> 🎵</Text>
                </TouchableHighlight>
                <View style={[styles.msgTextRight, {backgroundColor: '#5A8DFF'}]}>
                    <TouchableHighlight underlayColor={'#5A8DFF'} onPress={() => console.log('111')}>
                        <Text style={[styles.T5, styles.zh, {color: "#fff"}]}> 你好世界</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#5A8DFF'} onPress={() => {
                    }}>
                        <Text style={[styles.T6, styles.en, {color: "#fff"}, {opacity: 0.8}]}> hello，word</Text>
                    </TouchableHighlight>
                </View>


            </View>
            break;
        case 2:
            return <View style={[styles.msgRowRight]}>
                <View style={[styles.msgTextRight, {backgroundColor: '#5A8DFF'}]}>
                    <TouchableHighlight underlayColor={'#5A8DFF'} onPress={() => {
                    }}>
                        <Text style={[styles.T5, styles.en, {color: "#fff"}, {opacity: 0.8}]}> 34 "</Text>
                    </TouchableHighlight>
                </View>
            </View>
            break;
        case 3:
            return <View style={[styles.msgRowRight]}>
                <TouchableHighlight underlayColor={MsgColorTouchable}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                    }}>
                    <MsgImg/>
                </TouchableHighlight>
            </View>
            break;
    }

}


function MsgImg() {
    const [w, setW] = useState(0)
    const [h, setH] = useState(0)

    const window = useWindowDimensions();
    // let url ='https://reactnative.dev/img/tiny_logo.png'
    let url = 'https://grocery-cdn.huaban.com/file/a8dd66b0-fc09-11ec-9fff-7b7c4a1c3215.png'

    useEffect(() => {
        Image.getSize(url, (w, h) => {
            if (window.width * 0.5 < w) {
                console.log('2323', w * 0.5)
                setH(h * 0.5)
                setW(w * 0.5)
            } else {
                setH(h)
                setW(w)
            }
        })
    }, [])

    return <Image
        style={[styles.MsgImgs, {width: w, height: h}]}
        source={{
            uri: url,
        }}
    />
}

