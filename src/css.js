import {StyleSheet, useColorScheme} from 'react-native';


export const styles = StyleSheet.create({

    //联系人列表
    List: {
        flex: 1,
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
        flex: 1,
        height: 1,
        marginRight: 10,
        marginLeft: 10
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
    msgRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        borderRadius: 5,
        zIndex: 1
    },
    msgRowRight: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginRight: 20,
        marginBottom: 10,
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
        marginBottom:10,
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
    // 发送消息
    imSend: {
        flex: 1,
        zIndex: 100,
        width: '100%',
        position: "absolute",
        bottom: 0,
        left: 0,
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

    // 我的
    Me: {
        flex: 1,
        paddingTop: 30,
    },

    MeUse: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 30,
        marginLeft: 20
    },
    MeUseText: {
        display: "flex",
        justifyContent: "center",
        marginLeft: 15
    },
    MeInput: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingLeft: 15,
        paddingBottom: 5
    },
    MeInputs: {
        flex: 1,
        borderRadius: 3,
        marginLeft: 10,

    },

    // 登录
    Login: {
        flex: 1,
        paddingTop: 120,
    },

    LoginRow: {
        padding: 20,
    },
    LoginRowColor: {
        color: '#878BE4'
    },
    LoginInputs: {
        marginTop: 5,
        letterSpacing: 2,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius: 3,
    },
    LoginYe: {
        color: '#F9B719'
    },
    LoginRed: {
        color: '#F84848'
    },

    // 添加好友
    Add: {
        flex: 1
    },

    AddList: {
        marginTop: 20,
        marginLeft: 10,
    },

    //头像
    Portrait: {
        position: "relative",
        backgroundColor: "#fff"
    },
    PortraitImg: {
        position: "absolute",
        zIndex: 1
    },
    PortraitText: {
        fontSize: 13,
        position: "absolute",
        bottom: -5,
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

    //audio

    audioModel: {
        zIndex: 99,
        width: '100%',
        alignItems: "center",
        // backgroundColor:"#333",
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        position: "absolute",
        top: 0,
    },

    audioBody: {
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
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

    lightNsgBcB: {
        borderBottomColor: '#D9D9D9'
    },
    darkNsgBcB: {
        borderBottomColor: '#333C52'
    },


    lightBbC: {
        backgroundColor: "#EAEAEA",
    },
    darkBbC: {
        backgroundColor: "#404653",
    },

    //表情包按钮
    aBtn: {
        paddingLeft: 10,
        paddingRight: 10,
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
});
