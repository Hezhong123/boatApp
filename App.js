import React from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {styles} from "./src/css";
import {List} from "./src/views/list";
import {Im} from "./src/views/im";
import {Me} from "./src/views/me";
import {Add} from "./src/views/add";
import {Login} from "./src/views/login";

const Stack = createNativeStackNavigator();

export default function App() {
    const colorScheme = useColorScheme();
    const C1 = colorScheme == 'light' ? styles.lightC1 : styles.darkC1
    const scheme = colorScheme == 'light' ?  'black' :'white'

    return (
        <NavigationContainer  >
            <Stack.Navigator
                screenOptions={{
                    headerTintColor: scheme,
                    headerStyle: C1 }}>
                <Stack.Screen name="List" component={List}/>
                <Stack.Screen name="Im" component={Im}/>
                <Stack.Screen name="Me" component={Me}/>
                <Stack.Screen name="Add" component={Add}/>
                <Stack.Screen name="Login" component={Login}/>
            </Stack.Navigator>
        </NavigationContainer>

    )

}
