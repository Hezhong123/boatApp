// 选择图片
import {uploadCOS} from './cos'

// 选择图片上传
export const chooseMessageFile = (url)=>{
    wx.chooseMessageFile({
        count: 10,
        type: 'image',
        success (res) {
          const tempFilePaths = res.tempFiles
          tempFilePaths.map(item=>{
            uploadCOS(item.path,'im/image',cb=>{
                url(cb)
            })
          })
        }
      })
}

//新窗口 预览图片