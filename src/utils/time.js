export const timeIm = function (t) {
    let now = new Date();
    let time =  new Date(t)
    let minuteValue = (now-time)/60000 //分钟差
    let hourValue = (now-time)/3600000 //小时差
    let dayValue = (now-time)/86400000 //日期差
    let result = '' //返回结果
    if(minuteValue<=60){
        result = parseInt(minuteValue)?parseInt(minuteValue)+'分钟前':'刚刚'
    }else if(hourValue <= 24){
        result =parseInt(hourValue) + '小时前'
    }else if(dayValue<=3){
        result =parseInt(dayValue) + '天前'
    }else {
        result = time.getMonth()+1+'月' + time.getDate()+'日  '+time.getHours()+':'+time.getMinutes()
    }
    return result;

};

export const memberFun = (t)=>{
    let now = new Date();
    let time =  new Date(t)
    if(time>now){
        let dayValue = (time-now)/86400000 //日期差
        return 'd-'+parseInt(dayValue)
    }else {
        return '激活'
    }

}


//会员到期时间判定
export const memberBoolean = (t) => {
    let now = new Date();
    let time = new Date(t)
    if (time > now) {
        return true
    } else {
        return false
    }
}
