const baseURL = 'http://192.168.1.6:3000'; // 您的 API 根地址

export const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json', // 根据您的 API 要求设置
        'Authorization': `Bearer ${wx.getStorageSync('token')}` || '', // 如果需要 token 验证
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data); // 请求成功，将数据 resolve 出去
        } else {
          // 可以根据您的 API 返回结构进行更详细的错误处理
          reject({
            statusCode: res.statusCode,
            message: res.data.message || '请求失败',
          });
          wx.showToast({
            title: res.data.message || '请求失败',
            icon: 'none',
            duration: 2000,
          });
        }
      },
      fail: (err) => {
        reject({
          message: '网络错误，请稍后重试',
          error: err,
        });
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  });
};