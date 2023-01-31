import * as ImagePicker from "expo-image-picker";
import {useEffect, useState} from "react";
import {ActivityIndicator, Image, Text, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {_Avatar, _DelIm, _ListNull, oss} from "./Api";


export const OssImage = (props) => {
    const {userID, cb} = props
    const [load, setLoad] = useState(false)     //加载动画、

    const upImg = async () => {
        setLoad(true)
        let imgName = userID + Math.random().toString(36).substring(2);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            quality: 0.5,
        });
        console.log('选择图片',result)
        if (result.assets) {
            console.log('图片选择',result)
            const formData = new FormData()
            let data = {
                uri: result.assets[0].uri,
                type: "image/jpeg"
            }
            formData.append('key', `img/${imgName}.png`)
            formData.append('OSSAccessKeyId', 'LTAI7KYTQrVQf2gD')
            formData.append('signature', '1B342WN5/tSE8HAlUQ3QT1J/fk0=')
            formData.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==')
            formData.append('success_action_status', 201)
            formData.append('file', data)
            fetch(oss, {
                method: 'POST',
                body: formData
            }).then((responseJson) => {
                setLoad(false)
                cb(`${oss}/img/${imgName}.png`)
            }).catch((error) => {
                    console.error('上传图片', error);
                });
        } else {
            setLoad(false)
        }
    }
    return <View>
        {load ? <ActivityIndicator/> : <TouchableOpacity onPress={() => upImg()}>
            <Text style={{fontSize: 20, marginRight: 10}}>📷️</Text>
        </TouchableOpacity>}
    </View>
}

//更新头像
export const upAvatar = async (userID) => new Promise(async user => {
    let imgName = userID + Math.random().toString(36).substring(2);
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.1,
    });
    if (result.assets) {
        const formData = new FormData()
        let data = {
            uri: result.assets[0].uri,
            type: "image/jpeg"
        }
        formData.append('key', `user/${imgName}.png`)
        formData.append('OSSAccessKeyId', 'LTAI7KYTQrVQf2gD')
        formData.append('signature', '1B342WN5/tSE8HAlUQ3QT1J/fk0=')
        formData.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==')
        formData.append('success_action_status', 201)
        formData.append('file', data)
        fetch(oss, {
            method: 'POST',
            body: formData
        }).then((responseJson) => {
            let url = `${oss}/user/${imgName}.png`
            _Avatar(url).then(cb => user(cb))
        }).catch((error) => {
            console.error('上传头像失败', error);
        });
    }
})

//图像裁切
export function MsgImg(props) {
    const [w, setW] = useState(200)
    const [h, setH] = useState(200)
    const window = useWindowDimensions();
    useEffect(() => {
        Image.getSize(props.url, (w, h) => {
            let maxWidth = window.width * 0.7
            // console.log(maxWidth, '像素', window.width, w, maxWidth / w, h)
            if (window.width < w) {
                setH(h * (maxWidth / w))
                setW(maxWidth)
            } else {
                setH(h)
                setW(w)
            }
        })
    }, [])

    return <Image
        style={[{width: w, height: h, borderRadius: 5}]}
        source={{
            uri: props.url,
        }}
    />
}

