import {Alert, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {styles} from "../css";
import * as React from "react";
import {useRef} from "react";
import * as Clipboard from "expo-clipboard";

export function Btn(props){
    const colorScheme = useColorScheme();
    const color1 = colorScheme == 'light' ? styles.lightT1 : styles.darkT1

    const {text,press,fs} = props
    return  <TouchableOpacity
        style={[color1,styles.aBtn]}
        onPress={press}>
        <Text style={{fontSize:fs}}>{text}</Text>
    </TouchableOpacity>
}



export function TextClick(props){

    //点击，双击，长按，
    const {click=()=>{},doubleClick=()=>{},press=()=>{},slot} = props
    const backCount = useRef(0)
    const backTimer = useRef(null)
    return<TouchableOpacity onPress={() => {
        backCount.current++
        if (backCount.current == 2) {
            doubleClick()  //双击
            clearTimeout(backTimer.current)
        }else if(backCount.current == 1){
            click() //点击
        }else {
            backTimer.current = setTimeout(() => {
                backCount.current = 0
            }, 300)
        }
    }} onLongPress={()=>press()}>
        {slot}
    </TouchableOpacity>



}
