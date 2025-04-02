import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import {useEffect, useState} from "react";
import {ActivityIndicator, Image, Text, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {_Avatar, _DelIm, _ListNull, AwsToken, oss, url} from "./Api";
import S3 from "aws-sdk/clients/s3";

export const OssImage = (props) => {
    const {cb} = props
    const [load, setLoad] = useState(false)     //加载动画、
    const [image, setImage] = useState(null);

    const upImg = async () => {
        setLoad(true)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            quality: 0.5,
        });
        if (!result.canceled) {
            const file = result.assets[0]
            const { uri } = await FileSystem.getInfoAsync(file.uri);
            const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            console.log(file,fileContent)
            AwsToken(`msgIm/${file.fileName}`).then(async token => {
                // console.log("签名信息",token)
                let s3 = new S3({ // 用服务端返回的信息初始化一个 S3 实例
                    region: 'automatic',
                    endpoint: token.s3Endpoint,
                    credentials:token.credentials,
                    params: {
                        Bucket: token.s3Bucket
                    }
                });
                let targetKey = (token.keyPrefix || '*').replace('*', file.fileName);
                const s3Upload = s3.upload({
                    Key: targetKey,
                    Body: fileContent,
                    ContentType: file.mimeType // 设置上传后文件的 Content-Type 头，即 MIME 类型
                }).on('httpUploadProgress', function (evt) { // 上传进度回调函数
                    const percent = ((evt.loaded * 100) / evt.total).toFixed(2);
                    console.log("进度 : " + percent + '%');
                    console.log(`msgIm/${file.fileName}`)
                    // cb({
                    //     url:file.fileName,
                    //     percent: percent
                    // })
                });
                s3Upload.send(function (err, data) { // 上传结果
                    console.log("上传图片" + file.fileName)
                    setLoad(false)
                });
            })
            setLoad(false)
        }

        if (false) {
            // setLoad(false)
            // const formData = new FormData()
            // let data = {
            //     uri: result.assets[0].uri,
            //     type: "image/jpeg"
            // }
            // formData.append('key', `img/${imgName}.png`)
            // formData.append('OSSAccessKeyId', 'LTAI7KYTQrVQf2gD')
            // formData.append('signature', '1B342WN5/tSE8HAlUQ3QT1J/fk0=')
            // formData.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==')
            // formData.append('success_action_status', 201)
            // formData.append('file', data)
            // fetch(url, {
            //     method: 'POST',
            //     body: formData
            // }).then((responseJson) => {
            //     setLoad(false)
            //     cb(`${oss}/img/${imgName}.png`)
            // }).catch((error) => {
            //         console.error('上传图片', error);
            //     });
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
// export function MsgImg(props) {
//     const [w, setW] = useState(200)
//     const [h, setH] = useState(200)
//     const window = useWindowDimensions();
//     useEffect(() => {
//         Image.getSize(props.url, (w, h) => {
//             let maxWidth = window.width * 0.7
//             // console.log(maxWidth, '像素', window.width, w, maxWidth / w, h)
//             if (window.width < w) {
//                 setH(h * (maxWidth / w))
//                 setW(maxWidth)
//             } else {
//                 setH(h)
//                 setW(w)
//             }
//         })
//     }, [])
//
//     return <Image
//         style={[{width: w, height: h, borderRadius: 5}]}
//         source={{
//             uri: props.url,
//         }}
//     />
// }

