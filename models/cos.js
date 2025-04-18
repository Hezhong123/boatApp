import {cosToken} from './index'
import {request} from './request'
import COS from '../utils/cos-wx-sdk-v5.min'

export const upload =  async(filePath,path,cb) =>{
    let result = await cosToken(getFileExtension(filePath),path)
    const { credentials = {}, startTime, expiredTime, bucket, region, key } = result;
    const { tmpSecretId, tmpSecretKey, sessionToken } = credentials;
    // 校验 getUploadParams 返回参数，以实际返回格式为准
    const params = { tmpSecretId, tmpSecretKey, sessionToken, bucket, region, key };
    const emptyParam = Object.keys(params).find(key => !params[key]);
    if (emptyParam) {
       console.error(`参数错误: ${emptyParam} 不能为空`);
       return;
    }
    const cos = new COS({
        SecretId: tmpSecretId,
        SecretKey: tmpSecretKey,
        SecurityToken: sessionToken,
        StartTime: startTime,
        ExpiredTime: expiredTime,
        SimpleUploadMethod: 'putObject',
      });
       cos.uploadFile(
        {
          Bucket: bucket,
          Region: region,
          Key: key,
          FilePath: filePath,
          SliceSize: 1024 * 1024 * 5, // 文件大于5mb自动使用分块上传
        },
        function (err, data) {
          if (err) {
            console.error('上传失败', err);
            cb(false)
          } else {
            console.log('上传成功', data);
            cb(`https://${data.Location}`)
          }
        }
    );
}


function getFileExtension(filename) {
    if (!filename || typeof filename !== 'string' || filename.lastIndexOf('.') === -1) {
      return ""; // 处理空文件名、非字符串或没有扩展名的情况
    }
    return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
  }