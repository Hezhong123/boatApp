import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {bColor, fColor, headerColor, MstText, styles} from "./src/css";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {Index} from "./src/views";
import {Im} from "./src/views/im";
import useNotifications from "./src/utils/useNotifications";
import {navigationRef} from "./src/utils/rootNavigation";
import {Ticket} from "./src/views/ticket";
import {Add} from "./src/views/add";
import {Login} from "./src/views/login";
import {Me} from "./src/views/me";
import {Adds} from "./src/views/adds";
import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from "react";

const Stack = createNativeStackNavigator();

function App() {
    const schemes = useColorScheme();
    useNotifications()
    return (
        <NavigationContainer ref={navigationRef}>
            <StatusBar/>
            <Stack.Navigator initialRouteName='index' screenOptions={{
                headerTintColor: headerColor(schemes),
                headerStyle: bColor(schemes)
            }}>
                <Stack.Screen name="index" component={Index} options={{title: "小船Im"}}/>
                <Stack.Screen name="im" component={Im}/>
                <Stack.Screen name="me" component={Me}  options={{title: "我的"}} />
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="add" component={Add}  options={{title: "新的朋友"}}/>
                <Stack.Screen name="adds" component={Adds}  options={{title: "管理群"}}/>
                <Stack.Screen name="ticket" component={Ticket}  options={{title: "激活码"}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;


// adb install application-3fabca0f-17b2-4a3b-9a67-ebbadadb3793.apk

// eas build --profile preview

// eas update --branch preview
