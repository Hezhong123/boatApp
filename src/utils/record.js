import {Audio} from 'expo-av';
import {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Button, Pressable, Text, View} from "react-native";
import {styles} from "../css";
import axios from "axios";

let url = 'https://boatlmtext.oss-cn-guangzhou.aliyuncs.com'

export const Record = (props) => {
    const [load, setLoad] = useState(false)
    const [recording, setRecording] = useState();   //录音器
    const {userID,start,stop, cb} = props

    // 开始录音
    async function startRecording() {
        try {
            start()
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const {recording} = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    //结束录音
    async function stopRecording() {
        if(recording){
            let audioName = userID+Math.random().toString(36).substring(2);
            setRecording(undefined);
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            console.log('语音时长',recording._finalDurationMillis)
            stop('null')
            // 上传声音文件
            const formData = new FormData()
            let data = {
                uri: recording.getURI(),
                type: "audio/webm"
            }
            formData.append('key', `m4a/${audioName}.m4a`)
            formData.append('OSSAccessKeyId', 'LTAI7KYTQrVQf2gD')
            formData.append('signature', 'R2kloMky67ZNHiATW3E8J6PYnGc=')
            formData.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAyMy0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==')
            formData.append('success_action_status', 201)
            formData.append('file', data)
            setLoad(true)

            await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log('上传语音', res.data)
                setLoad(false)
                cb(`https://boatlmtext.oss-cn-guangzhou.aliyuncs.com/m4a/${audioName}.m4a`)
            }, err => {
                setLoad(false)
                console.log('上传语音失败', err)
            })
        }else {
            stop('null')
            console.log(222)
        }

    }

    return (
        <View style={styles.audio}>
            {load ? <ActivityIndicator/> : <Pressable
                delayLongPress={1000}
                onPressIn={()=>startRecording()}
                onPressOut={() => stopRecording()}>
                <Text style={{fontSize: 20, marginLeft: 5}}>🎙</Text>
            </Pressable>}

        </View>
    );
}




