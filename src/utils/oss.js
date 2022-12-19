import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {useState} from "react";
import {ActivityIndicator, View} from "react-native";
import {Btn} from "../component/btn";
import {_avatar} from "../_Api";

let url='https://boatlmtext.oss-cn-guangzhou.aliyuncs.com/'
// let url = 'http://192.168.0.101:3000/uploads'

export const OssImage = (props) => {
    const {userID,cb} = props
    const [load, setLoad] = useState(false)     //加载动画、

    const upImg = ()=>{
        setLoad(true)
        let imgName = userID+Math.random().toString(36).substring(2);
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            // allowsEditing: true,
            // aspect: [4, 3],
            quality: 0.5,
        }).then(res => {
            if(res.cancelled){  //取消选择图
                setLoad(false)
            }else {
                const formData = new FormData()
                console.log('选择图片', res)
                let data = {
                    uri : res.uri,
                    type: "image/jpeg"
                }
                formData.append('key', `img/${imgName}.png`)
                formData.append('OSSAccessKeyId', 'LTAI7KYTQrVQf2gD')
                formData.append('signature', 'R2kloMky67ZNHiATW3E8J6PYnGc=')
                formData.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAyMy0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==')
                formData.append('success_action_status', 201)
                formData.append('file',data)
                axios.post(url, formData,{
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    console.log('上传图片', res.data)
                    cb(`https://boatlmtext.oss-cn-guangzhou.aliyuncs.com/img/${imgName}.png`)
                    setLoad(false)
                }, err => {
                    console.log('上传图片失败', err)
                    setLoad(false)
                })
            }
        });
    }

    return <View>
        {load?<ActivityIndicator/>:<Btn  text={'📷️'} fs={20} press={()=>upImg() } />}
    </View>

}


//更新头像
export const upAvatar = (userID,cb) => {
    let imgName = userID+Math.random().toString(36).substring(2);
    ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.1,
    }).then(res => {
        if(res.cancelled){  //取消选择图

        }else {
            const formData = new FormData()
            console.log('选择图片', res)
            let data = {
                uri : res.uri,
                type: "image/jpeg"
            }
            formData.append('key', `user/${imgName}.png`)
            formData.append('OSSAccessKeyId', 'LTAI7KYTQrVQf2gD')
            formData.append('signature', 'R2kloMky67ZNHiATW3E8J6PYnGc=')
            formData.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAyMy0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==')
            formData.append('success_action_status', 201)
            formData.append('file',data)
            axios.post(url, formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                let url= `https://boatlmtext.oss-cn-guangzhou.aliyuncs.com/user/${imgName}.png`
                // console.log('上传头像', res.data)
                _avatar(url,user=>{
                    console.log('用户信息', user )
                    cb(user)
                })
            }, err => {
                console.log('上传头像失败', err)
            })
        }
    });
}
