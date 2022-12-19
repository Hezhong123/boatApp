import {Image, Text, View} from "react-native";
import {styles} from "../css";
import {useEffect, useState} from "react";

export function Portrait(props) {
    const {w, h, r, t, url, unread = 0} = props
    return <View style={[styles.Portrait, {width: w, height: h, borderRadius: r}]}>
        {unread ? <Text style={styles.PortraitNum}>{unread}</Text> : ''}
        <Image style={[styles.PortraitImg, {width: w, height: h, borderRadius: r}]}
               source={{
                   uri: url,
               }}/>
        <Text style={styles.PortraitText}>{t}</Text>
    </View>
}

export function Portraits(props) {
    const {imgArr, unread = 0} = props
    const [w,setW] = useState(12)
    const [h,setH] = useState(12)


    useEffect(()=>{
        if(imgArr.length <= 4){
            setW(18)
            setH(18)
        }
    },[])

    return <View style={[styles.Portrait,styles.Portraits]}>
        {unread ? <Text style={styles.PortraitNum}>{unread}</Text> : ''}
        {imgArr.map((item, i) =>
            <Image key={'img'+i} style={[styles.PortraitImgs,{width: w, height: h,}]}
                   source={{
                       uri: item.avatar,
                   }}/>)}
    </View>
}
