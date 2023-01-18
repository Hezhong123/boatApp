import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import navigation from './rootNavigation';

const useNotifications = () => {
    let notificationListener = React.createRef();

    useEffect (  () => {

        // 获取推送令牌
        // notificationListener.current = Notifications.addNotificationReceivedListener(
        //     (notification) => {
        //         // setNotification(notification);
        //         console.log(notification);
        //     }
        // );

        notificationListener.current =
            Notifications.addNotificationResponseReceivedListener(res => {
                let nav = res.notification.request.content.data
                console.log(nav);
                console.log('addNotificationResponseReceivedListener');
                navigation.navigate(nav.url);
            });

        return () =>
            Notifications.removeNotificationSubscription(notificationListener);
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

export const pushNotifications = async (title,body) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: { url: 'im',id:'22111'}
        },
        trigger: null,
    });
}


