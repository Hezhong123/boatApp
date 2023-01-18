import {Text, useColorScheme, View} from "react-native";
import {bColor, fColor, styles} from "../css";

export function Ticket({navigation}){
    const schemes = useColorScheme();
    return (
        <View style={[styles.flex, bColor(schemes)]}>
            <Text style={fColor(schemes)}>激活码</Text>
        </View>
    )
}
