import {Image, Text, View} from "react-native";
import {styles} from "../css";

export function Portrait(props){
    const {w,h,r,t,url} = props
    return <View style={[styles.Portrait,{width:w,height:h,borderRadius:r}]}>
        <Image style={[styles.PortraitImg,{width:w,height:h,borderRadius:r}]}
               source={{
                   uri: url,
               }}/>
        <Text style={styles.PortraitText} >{t}</Text>
    </View>
}
