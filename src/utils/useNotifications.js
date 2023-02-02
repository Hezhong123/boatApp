import React, {useEffect, useState} from 'react';
import * as Notifications from 'expo-notifications';

import navigation from './rootNavigation';
import {AppState} from "react-native";
import {io} from "socket.io-client";
import {_User, wss} from "./Api";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastAndroid from "react-native/Libraries/Components/ToastAndroid/ToastAndroid";
import {useNavigationContainerRef} from "@react-navigation/native";
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
    const navigationRef = useNavigationContainerRef()
    useEffect (  () => {

        // 获取推送令牌
        // notificationListener.current = Notifica   tions.addNotificationReceivedListener(
        //     (notification) => {
        //         // setNotification(notification);
        //         console.log(notification);
        //     }
        // );

        AppState.addEventListener("change", async (handler) => {
            AsyncStorage.getItem('user').then(res=>{
                let user = JSON.parse(res)
                // console.log('开启通知推送',user,handler)
                if(user.name && handler == 'background'){
                    socket.on(`_${user._id}`,async im => {
                        let name = ()=>{
                            if(im.imType == 1){
                                return user.id == im.userArr[0].id ? im.userArr[1].name :im.userArr[0].name
                            }else {
                                return im.imTitle
                            }
                        }
                        // console.log('推送', name(),im)
                        await pushNotifications(name(), im.text, im._id)
                    })
                }
                if(user.name){
                    if(handler == 'active' || handler =='active'){
                        socket.off(`_${user._id}`)
                        console.log('断开同志链接')
                    }
                }
            })

        })



        notificationListener.current = Notifications.addNotificationResponseReceivedListener(res => {
                let nav = res.notification.request.content.data
                console.log('addNotificationResponseReceivedListener',nav);
                navigation.navigate('index')
                setTimeout(()=>{
                    navigation.navigate(nav.url,{list:nav.list});
                },300)

            });

        return () =>{
            Notifications.removeNotificationSubscription(notificationListener);
        }


    }, []);
};
export default useNotifications;


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export const pushNotifications = async (title,body,listID) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: { url: 'im',list:listID}
        },
        trigger: null,
    });
}


