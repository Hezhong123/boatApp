// 录制声音
import {uploadCOS} from './cos'
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext({
    useWebAudioImplement: true 
})

const backgroundAudioManager = wx.getBackgroundAudioManager()

export const startAidoe = (cb)=>{
      recorderManager.start({
        duration: 10000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 64000,
        format: 'mp3',
        frameSize: 50
      });
      recorderManager.onStart((res) => {
        console.log('recorder start', res)
        cb()
      })
}

export const stopAidoe  = (cb) =>{
    recorderManager.stop()
    recorderManager.onStop(res=>{
        console.log('停止录制',res);
        let duration = parseInt(res.duration / 1000)
        cb(null)
        if(duration){
            uploadCOS(res.tempFilePath, 'im/aideo', call=>{
                cb(JSON.stringify({
                    url:call,
                    duration:duration
                }))
            })
        }else{
            wx.showToast({
                title: '时间太短',
                icon: 'none',
                duration: 1000
            })
        }
    })
}

export const backgroundAudio = (url,cb)=>{
   
    backgroundAudioManager.src =url
    backgroundAudioManager.title = '跟读'; // 音樂標題
    backgroundAudioManager.play()
    backgroundAudioManager.onEnded(() => {
        console.log('播放結束');
        cb()
    });
}