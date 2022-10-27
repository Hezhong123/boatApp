import {Image, Text, View} from "react-native";
import {styles} from "../css";

let url ='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F23%2F20210723125859_f6b2f.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668231868&t=d9769a5a7ef2aed3f1e392d3b1619af7'

export function Portrait(props){
    const {w,h,r,t} = props
    return <View style={[styles.Portrait,{width:w,height:h,borderRadius:r}]}>
        <Image style={[styles.PortraitImg,{width:w,height:h,borderRadius:r}]}
               source={{
                   uri: url,
               }}/>
        <Text style={styles.PortraitText} >{t}</Text>
    </View>
}