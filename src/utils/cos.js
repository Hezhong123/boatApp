import {ActivityIndicator, Text, Image, TouchableOpacity, useWindowDimensions, View, Dimensions} from "react-native";
import React, {useEffect, useState} from "react";
import {_Authorization, _Avatar, oss, ToastShow, url} from "./Api";
import * as ImagePicker from "expo-image-picker";

export function CosImg(props) {
    const {cb}=props
    const [load,setLoad] = useState(false);
    async function upImg() {
        setLoad(true)
        // console.log('Cos',cosAuth)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            quality: 0.5,
        });

        if (!result.canceled) {
            const file = result.assets[0]
            let cosAuth = await _Authorization('imMsg', file.type)
            console.log('图片选择',file,file.type)
            let data = {
                uri: file.uri,
                type: file.mimeType
            }
            upload(cosAuth,data).then(res=>{
                cb(res)
                console.log('上传成功',res)
                setLoad(false)
            },err=>{
                setLoad(false)
                ToastShow('上传失败')
            })
        } else {
            setLoad(false)
        }
    }
    return  <View>
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
    let cosAuth = await _Authorization('avatar', 'png')
    if (!result.canceled) {
        const file = result.assets[0]
        let cosAuth = await _Authorization('imUser', file.type)
        let data = {
            uri: result.assets[0].uri,
            type: file.mimeType
        }
        upload(cosAuth,data).then(res=>{
            console.log('上传头像成功',res)
            _Avatar(res).then(res=>user(res))
        },err=>{
            ToastShow('上传失败')
        })

    }
})


export function  upload(result,file){
    console.log('上传图片',result)
    const cosHost = result.cosHost;
    const cosKey = result.cosKey;
    const authorization = result.authorization;
    const securityToken = result.securityToken;

// Build the upload URL
    const uploadURL = `https://${cosHost}/${cosKey}`;
// Prepare the request options
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': file.size, // Assuming 'data' is the file content as a Blob object
            'Authorization': authorization,
            'x-cos-security-token': securityToken,
            'Host': cosHost
        },
        body: file
    };

// Fetch API call for upload
    return fetch(uploadURL, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
            return  uploadURL
            console.log('Upload successful!');
        })
        .catch(error => {
            console.error('Upload failed:', error);
        });
}


//图像裁切
export function MsgImg(props) {
    const [w, setW] = useState(200)
    const [h, setH] = useState(200)
    const window = useWindowDimensions();

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const maxImageWidth = screenWidth * 0.6;
    const maxImageHeight = screenHeight * 0.6;

    useEffect(() => {
        Image.getSize(props.url, (_w, _h) => {
            setH(_w)
            setW(_h)
        })
    }, [])

    return <Image
        style={[{width: Math.min(maxImageWidth, w || 0), height: Math.min(maxImageHeight, h || 0), borderRadius: 5}]}
        source={{
            uri: props.url,
        }}
        resizeMode="contain"
    />
}
