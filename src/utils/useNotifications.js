import React, {useEffect, useRef, useState} from 'react';
import * as Notifications from 'expo-notifications';
import navigation from './rootNavigation';
import {AppState} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {io} from "socket.io-client";
import {_User, wss} from "./Api";

const socket = io(wss)

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
    }),
});


const useNotifications = () => {
    let notificationListener = React.createRef();
    let userData = React.createRef();
    let handler = React.createRef()
    useEffect(() => {

        // 获取推送令牌
        // notificationListener.current = Notifications.addNotificationReceivedListener(
        //     (notification) => {
        //         // setNotification(notification);
        //         console.log('推送令牌', notification);
        //     }
        // );


        AppState.addEventListener('change',handlerFun=>{
            handler.current = handlerFun
        })
        AsyncStorage.getItem('user').then(res=>{
            let user = JSON.parse(res)
            userData.current = user
            socket.on(`_${user._id}`,async im => {
                if (handler.current == 'background') {
                    navigation.navigate('index')
                    let name = () => {
                        if (im.imType == 1) {
                            return user.id == im.userArr[0].id ? im.userArr[1].name : im.userArr[0].name
                        } else {
                            return im.imTitle
                        }
                    }
                    await pushNotifications(name(), im.text, im._id)
                }
            })
        })

        notificationListener.current = Notifications.addNotificationResponseReceivedListener(res => {
            let nav = res.notification.request.content.data
            console.log('addNotificationResponseReceivedListener', nav);
            navigation.navigate(nav.url, {list: nav.list});
        });

        return () => {
            socket.off(`_${userData.current._id}`)
            Notifications.removeNotificationSubscription(notificationListener);
        }


    }, []);
};
export default useNotifications;

export const pushNotifications = async (title, body, listID) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: {url: 'im', list: listID}
        },
        trigger: null,
    });
}

export const Add = (_userID) => {

}




