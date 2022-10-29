> 20221026
## 🚣 小船Im 
这是一款双语即使通讯App，能够在对话的场景里出现中英文互译的句子，
从而被动的提升我这拉垮的英文水平。

###  产出平台
* Android 
* ios
* Web

### 技术方案
* 移动端：reactNative集成框架Expo
* 服务端：koa2+mongodb
* 云端：腾讯云contOs7.6
* 存储端：阿里云Oss

### 使用工具
* sketch 原型UI
* node 运行环境
* webStorm 代码开发
* postMan Api测试工具
* mongodbComponent 数据库管理工具
* android 模拟器
* ios 模拟器

***
    
## No1： 立项！ 造条小船出海去、、

海：指的是困境。出海的意思自然就是走出困境的意思； 

造条小船：大概的意思就是动手制作工具摆脱困境。

接下来的意思就是我会整个App的制作过程用文字｜视频的形式记录下来。

* [哔哩哔哩](https://space.bilibili.com/133278591) 
* [YouTube](https://www.youtube.com/channel/UC7SjqRUqE-2r3XJ3274DiYQ)
* [抖音](https://www.douyin.com/user/MS4wLjABAAAAzLXcL2vZ0JGJsFCzFbcgiQVBLFJQ_XM-AEBfEwvjdhc)

大家先看看软件的UI部分：
我在android和ios模拟器上演示，因为我的移动端技术方案是reactNative。



### 01： 对话列表
这里我把联系人和对话列表合二一，因为社恐的人不需要联系人。

![联系人模块](https://raw.githubusercontent.com/Hezhong123/boatApp/main/mdImg/add.gif)

整个模块稍微复杂一点的功能是动态更新，收到新的消息，列表会自动刷新。
***

### 02：会话模块：
![对话](https://github.com/Hezhong123/boatApp/blob/main/mdImg/im.gif?raw=true)

群聊天，和个人对话大致差不多，
亮点就是双语显示的界面。

在输入框上面的两个小按钮，

✏️  词列：开启这个功能，可以看见从单词到译文的整个过程，加深记忆。

🎧 跟读：开启这个功能，播放当前对话下的译文。
***

### 03： 添加好友

![添加好友](https://github.com/Hezhong123/boatApp/blob/main/mdImg/add.gif?raw=true)

这里我使用了大量的表情,自动屏蔽一部分不年轻的人。

* 🔍 搜索用户
* 👋 打招呼
* 👎 拒绝对话
* 🤝 同意对话


*** 

### 04：我的

![我的](https://github.com/Hezhong123/boatApp/blob/main/mdImg/me.gif?raw=true)

现实用户基本信息：头像，昵称，ID ；
* 点击头像修改头像，
* 点击昵称修改昵称。

收藏列表： 收集平时会话的内容，有搜索功能。

***

### 05：登陆
![登陆](https://github.com/Hezhong123/boatApp/blob/main/mdImg/login.gif?raw=true)

现在显示是短信登陆验证码，但是后面我可能会采用邮件验证码登陆。

😭😭😭 主要是短信有点贵 ！！！
*** 

### 06： 即时通话
先用postMan测试后端的即时通讯部分，

![imApi](https://github.com/Hezhong123/boatApp/blob/main/mdImg/imApi.gif?raw=true)

大概io信道有3条：

* 联系人：用于对话列表更新
* 对话：1v1对话使用
* 群聊：1vN 群聊使用

简单演示下，这是输入中文获得译文基本数据
***

### 07：其他Api模块
![api接口](https://github.com/Hezhong123/boatApp/blob/main/mdImg/api.gif?raw=true)

* 用户模块
* 收藏模块
* 信道模块
* 工具（图片/声音上传，支付，短信，邮件）





