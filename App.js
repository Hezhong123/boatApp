import React from 'react';
import {StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {styles} from "./src/css";
import {List} from "./src/views/list";
import {Im} from "./src/views/im";
import {Me} from "./src/views/me";
import {Add} from "./src/views/add";
import {Login} from "./src/views/login";
import {Adds} from "./src/views/adds";
import {Ticket} from "./src/views/ticket";

const Stack = createNativeStackNavigator();

export default function App() {
    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const scheme = colorScheme == 'light' ?  'black' :'white'
    const Bar = colorScheme == 'light'?'dark-content':'light-content'
    const BarColor = colorScheme == 'light'?'#F2F2F2':'#2B3140'

    return (
        <NavigationContainer  >
            <StatusBar barStyle={Bar} backgroundColor={BarColor} />
            <Stack.Navigator
                screenOptions={{
                    headerTintColor: scheme,
                    headerStyle: C1 }}>
                <Stack.Screen name="List" component={List} options={{title:"小船Im"}} />
                <Stack.Screen name="Im" component={Im}/>
                <Stack.Screen name="Me" component={Me}/>
                <Stack.Screen name="Add" component={Add}/>
                <Stack.Screen name="Adds" component={Adds}/>
                <Stack.Screen name="Ticket" options={{title:"解锁全功能"}} component={Ticket}/>
                <Stack.Screen name="Login" component={Login}/>
            </Stack.Navigator>
        </NavigationContainer>

    )

}
