import {Image, Text, View} from "react-native";
import {styles} from "../css";

export function Portrait(props){
    const {w,h,r,t,url,unread=0} = props
    return <View style={[styles.Portrait,{width:w,height:h,borderRadius:r}]}>
        {unread?<Text style={styles.PortraitNum} >{unread}</Text>:''}
        <Image style={[styles.PortraitImg,{width:w,height:h,borderRadius:r}]}
               source={{
                   uri: url,
               }}/>
        <Text style={styles.PortraitText} >{t}</Text>
    </View>
}
