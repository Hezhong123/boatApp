import React, {useEffect, useState} from 'react';
import * as Notifications from 'expo-notifications';

import navigation from './rootNavigation';
import {AppState} from "react-native";
import {io} from "socket.io-client";
import {_User, wss} from "./Api";
import * as Haptics from "expo-haptics";
const socket = io(wss)



const useNotifications = () => {
    let notificationListener = React.createRef();
    const [userId,setUserId] = useState('')
    useEffect (  () => {

        // 获取推送令牌
        // notificationListener.current = Notifica   tions.addNotificationReceivedListener(
        //     (notification) => {
        //         // setNotification(notification);
        //         console.log(notification);
        //     }
        // );


        AppState.addEventListener("change", async (handler) => {
            let user =  await _User()
            console.log('handler', handler)
            if (handler == 'background') {
                socket.on(user._id, async im => {
                    console.log('离线推送', im)
                    await pushNotifications( im.imType == 1? im.user.name:im.imTitle, im.text, im._id)
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)//震动手机
                })
                setUserId(user._id)
            }
            if (handler == 'active') {
                console.log('断开链接')
                socket.off(user._id)// 断开链接
            }
        })

        notificationListener.current = Notifications.addNotificationResponseReceivedListener(res => {
                let nav = res.notification.request.content.data
                console.log('addNotificationResponseReceivedListener',nav);
                navigation.navigate(nav.url,{list:nav.list});
            });

        return () =>{
            Notifications.removeNotificationSubscription(notificationListener);
            socket.off(userId)// 断开链接
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


