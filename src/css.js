import {StyleSheet} from 'react-native';

//背景颜色
export const bColor = (schemes)=>{
    return  schemes=='light'?{
            backgroundColor: "#F2F2F2",
        }:
        {
            backgroundColor: "#2B3140"
        }
}

//状态栏
export const headerColor = (schemes)=>{
    return schemes == 'light' ? 'black' : 'white'
}

//点击对话框
export const MsgColorTouchable = (schemes)=>{
  return schemes == 'light' ? '#EAEAEA' : '#333C52'
}

//对话框配色
export const MsgColor = (schemes)=>{
    return schemes == 'light' ? {backgroundColor: '#EAEAEA'} : {backgroundColor: '#333C52'}
}

export const BbC =(schemes)=>{
   return  schemes == 'light' ? { backgroundColor: "#EAEAEA"}: {backgroundColor: "#404653"}
}

// 输入框边框色
export const inputBorderColor =(schemes)=>{
    return  schemes == 'light' ? {borderColor: '#696A80'} : {borderColor: '#fff'}
}


//对话框分割线
export const lightNsgBcB =(schemes)=>{
    return schemes == 'light' ? {backgroundColor: '#e2e2e2'} : {backgroundColor: '#2f2f2f'}
}
//对话框颜色
export const MstText =(schemes)=>{
    return schemes == 'light' ? {color: '#222222'} : {color: '#ffffff'}
}

//输入框
export const placeholderColor =(schemes)=>{
    return schemes == 'light' ? '#222222' :'#ffffff'
}

//暗色字体
export const fColor = (schemes) => {
    return  schemes=='light'?{
        color: "#3F413C",
    }:{
        color: "#fff",
    }
}

export const styles = StyleSheet.create({
    isConnected:{
        flex: 1,
        backgroundColor:"#333",
        alignItems:"center",
        justifyContent:"center"
    },
    //联系人列表
    List: {
        flex: 1,

    },
    listTitle: {
        marginRight: 10,
        position: "relative",
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: 'center'
    },
    listTitleT1: {
        fontSize: 18,

    },
    listTitleT2: {
        width: 13,
        height: 13,
        fontWeight: "bold",
        fontSize: 10,
        textAlign: "center",
        borderRadius: 5,
        lineHeight: 13,
        backgroundColor: "#E02020",
        color: "#fff",
        position: "absolute",
        right: -4,
        top: -2,
    },
    ListRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 5,
        marginRight: 5,
        marginTop: 15,
        paddingLeft: 10,
        paddingBottom: 15,
    },
    listImg: {
        width: 43,
        height: 43,
        borderRadius: 5,
        backgroundColor: "#ffffff"
    },
    ListLi: {
        marginLeft: 15,
        flex: 1,
        justifyContent: "center",
        textAlign: "right",
    },
    listBbC: {
        width: "100%",
        height: 1
    },

    yan: {
        height: 48,
        flexDirection: "row",
        paddingTop: 2,
    },
    yanIco: {
        marginRight: 5,
        marginLeft: 5,
        marginBottom: 10,
    },

    listLogin: {
        flex: 1,
        display: "flex",
        alignItems: 'center',
        paddingTop: 30,
    },
    listLoginImg: {
        backgroundColor: "#333",
        width: 300,
        height: 200,
    },
    listBtn: {
        letterSpacing: 4,
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 16,
        color: "#5A8DFF",
        textAlign: "center"
    },

    // im对话
    Im: {
        flex: 1
    },
    ImMsg: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        display: "flex",
        flexDirection: "row",
    },
    container: {
        flex: 1,
    },
    msgRow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginLeft: 10,
        borderRadius: 5,
        zIndex: 1
    },
    msgRowRight: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginRight: 20,
        marginBottom: 10,
        position: "relative"
    },
    flot: {
        marginTop: 1,
        display: "flex",
        flexDirection: "row",
        borderRadius: 4,
        opacity: 0.8,
        zIndex: 100,
    },
    flotText: {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 11,
    },
    flotHx: {
        width: 1,
        height: 19
    },
    msgText: {
        display: "flex",
        justifyContent: "center",
        borderRadius: 3,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10
    },
    zh: {
        // letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#A6BCEC',
        paddingTop: 2,
        paddingBottom: 3,
    },
    en: {
        // letterSpacing: 1,
        paddingTop: 2,
        paddingBottom: 2,
    },
    time: {
        marginLeft: -10,
        opacity: 0.8,
        fontSize: 11,
        marginBottom: 10,
        textAlign: "center",
    },
    msgAudio: {
        marginLeft: 10,
        marginRight: 10,
    },
    msgTextRight: {
        display: "flex",
        justifyContent: "center",
        borderRadius: 5,
        padding: 5,

    },
    MsgTime: {
        textAlign: "center",
        margin: 10,
        letterSpacing: 2,
        fontSize: 10,
        color: '#AFB1B7'
    },
    ims: {
        flex: 1,
    },
    // 发送消息
    imSend: {
        zIndex: 100,
        width: '100%',
        position: "absolute",
        bottom: 0,
        left: 0,
    },
    imSendBtn: {
        backgroundColor: "#5A8DFF",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3,
        color: "#fff",
        fontSize: 12,
        marginLeft: 10,
        letterSpacing: 1,
        fontWeight: "bold"
    },
    imFun: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
    },
    imWord: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: "wrap"
    },
    imWords: {
        color: '#fff',
        fontWeight: "bold",
        fontSize: 12,
        borderRadius: 2,
        letterSpacing: 1,
        backgroundColor: '#5A8DFF',
        marginLeft: 3,
        marginBottom: 3,
        padding: 1
    },
    imInput: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 3,
        paddingBottom: 8,
    },
    imInputSend: {
        minHeight: 38,
        marginBottom: 0,
        flex: 1,
        letterSpacing: 1,
        backgroundColor: '#EAEAEA',
        color: '#2e2e2e',
        borderRadius: 3,
        padding: 2,
        paddingLeft: 5,
        paddingRight: 5,
    },

    Word: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "stretch",
        justifyContent: 'flex-end'
    },
    Words: {
        padding: 15,
    },
    WordBtn: {
        textAlign: "right",
        paddingRight: 15,
        paddingBottom: 10
    },
    // 我的
    Me: {
        flex: 1,
        paddingTop: 30,
    },

    MeUse: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        marginLeft: 20
    },
    MeUseText: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        marginLeft: 15
    },
    MeInput: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 15,
        paddingBottom: 5
    },
    vip: {
        color: "#5A8DFF",
        letterSpacing: 1,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#5A8DFF",
        paddingLeft: 5,
        paddingRight: 15,
        paddingTop: 2,
        paddingBottom: 2
    },
    MeInputs: {
        flex: 1,
        borderRadius: 3,
        marginLeft: 10,
        marginRight: 10,
        padding: 3,
        backgroundColor: "#fff",
        paddingTop: 6,
        paddingBottom: 6,
    },

    // 激活码
    jMa: {
        flex: 1,
        paddingTop: 15,
        paddingLeft: 15,
    },
    jMaSend: {
        marginTop: 10,
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    jMaInput: {
        flex: 1,
        borderRadius: 3,
        padding: 5,
        width: 200,
        fontSize: 15,
        letterSpacing: 2,
        marginRight: 15,
    },
    jMaBtn: {
        marginLeft: 10,
        marginRight: 15,
        color: "#5A8DFF",
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center"
    },
    jMList: {
        flex: 1,
    },
    jMLists: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    // 登录
    Login: {
        flex: 1,
        paddingTop: 120,
        paddingLeft:20,
        paddingRight:20
    },

    LoginRow: {
        padding: 20,
    },
    LoginRowColor: {
        color: '#878BE4'
    },
    LoginInputs: {
        letterSpacing: 2,
        marginTop:5,
        paddingLeft:5,
        borderWidth: 1,
        height:30,
        borderRadius: 3
    },
    LoginYe: {
        color: '#F9B719'
    },
    LoginRed: {
        color: '#F84848'
    },
    loginBtn: {
        backgroundColor: '#5A8DFF',
        borderColor: "#fff",
        // borderWidth:1,
        lineHeight: 20,
        fontSize: 15,
        fontWeight: "bold",
        padding: 5,
        color: "#fff",
        width: 80,
        height: 30,
        textAlign: "center",
        marginTop: 20,
        borderRadius: 5,
    },
    canvas: {
        backgroundColor: "#333",
        width: 60,
        height: 23,
        position: "absolute",
        right: 3,
        bottom: 10,
    },
    // 添加好友
    Add: {
        flex: 1
    },

    AddList: {
        marginTop: 20,
        marginLeft: 10,
    },

    //添加群聊
    imAdd: {
        width: '100%',
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    imQ: {
        flex: 1,
    },
    imOff: {
        fontSize: 20,
        position: "absolute",
        top: -30,
        right: 10
    },
    AddImg: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingLeft: 10,
    },
    addIm: {
        marginRight: 5,
        marginBottom: 10,
        alignItems: "center",
        maxWidth: 50,
    },
    addRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    addInouts: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    addInput: {
        flex: 1,
        letterSpacing: 1,
        backgroundColor: "#333",
        padding: 5,
        marginLeft: 5,
        marginRight: 5,

    },

    //头像
    Portrait: {
        position: "relative",
        backgroundColor: "#fff",
    },
    Portraits: {
        width: 36,
        height: 36,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: 'none'
    },
    PortraitImg: {
        position: "absolute",
        zIndex: 1
    },
    PortraitImgs: {
        borderRadius: 2
    },
    PortraitText: {
        fontSize: 15,
        position: "absolute",
        bottom: -3,
        right: -3,
        zIndex: 3,
    },
    PortraitNum: {
        width: 13,
        height: 13,
        fontWeight: "bold",
        fontSize: 10,
        textAlign: "center",
        borderRadius: 5,
        lineHeight: 13,
        position: "absolute",
        backgroundColor: "#E02020",
        color: "#fff",
        top: -2,
        left: -5,
        zIndex: 3
    },
    upName: {
        flexDirection: "row"
    },
    upNameInput: {
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 13,
        borderRadius: 5,
        flex: 1,
    },
    //audio
    audioModel: {
        flex: 1,
        width: '100%',
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99,
    },
    audioBody: {
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#5A8DFF"
    },
    audioIcon: {
        width: 30,
        height: 30
    },
    Send: {
        padding: 3,
        letterSpacing: 2,
        borderRadius: 3,
        // boxShadow:
    },

    // 背景颜色
    darkC1: {
        backgroundColor: "#2B3140"
    },
    lightC1: {
        backgroundColor: "#F2F2F2"
    },

    // 联系人列表
    darkC2: {
        color: "#ffffff"
    },
    lightC2: {
        color: "#3F413C",
    },

    // 对话
    lightMsg: {
        backgroundColor: '#EAEAEA'
    },
    darkMsg: {
        backgroundColor: '#333C52'
    },

    //表情包按钮
    aBtn: {
        paddingLeft: 10,
        paddingRight: 10,
    },

    red: {
        color: "#E02020",
    },
    //字体
    bold: {
        fontWeight: "bold",
        letterSpacing: 1
    },
    T1: {
        fontSize: 26
    },
    T2: {
        fontSize: 23
    },
    T3: {
        fontSize: 18
    },
    T4: {
        fontSize: 16
    },
    T5: {
        fontSize: 13
    },
    T6: {
        fontSize: 11
    },
})




