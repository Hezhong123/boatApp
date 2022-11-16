import {Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {styles} from "../css";

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
