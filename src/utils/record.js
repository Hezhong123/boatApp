import {Audio} from 'expo-av';
import {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Button, Pressable, Text, View} from "react-native";
import {styles} from "../css";
import {_Authorization, _Avatar, oss, ToastShow} from "./Api";
import {upload} from "./cos";


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
            console.log('语音时长',`m4a/${audioName}.m4a`, recording._finalDurationMillis)
            stop('null')
            // 上传声音文件
            let cosAuth = await _Authorization('imAudio', 'm4a')
            let data = {
                uri: recording.getURI(),
                type: "audio/webm"
            }
            upload(cosAuth,data).then(res=>{
                cb(res)
                console.log('声音上传成功',res)
                setLoad(false)
            },err=>{
                setLoad(false)
                ToastShow('声音上传失败')
            })
        }else {
            stop('null')
        }
    }
    return (
        <View>
            {load ? <ActivityIndicator/> : <Pressable
                delayLongPress={300}
                onLongPress={()=>startRecording()}
                onPressOut={() => stopRecording()}>
                <Text style={{fontSize: 20, marginLeft: 5}}>🎙</Text>
            </Pressable>}
        </View>
    );
}