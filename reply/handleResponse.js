/*
    处理用户发送的消息,定义响应的数据.
*/

//实现自动回复功能
function handleResponse(userData){
    let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type:'text',
        //设置关注后的自动提示语
        content:'请输入你想知道的内容~'
    };

    if(userData.MsgType === 'text'){
        if(userData.Content === '11'){
            options.content = '明月几时有?';
        }else if(userData.Content && userData.Content.indexOf('12') !== -1){
            //模糊匹配
            options.content = '把酒问青天';
        }
    } else if(userData.MsgType === 'image'){
        //将用户发送的图片，返回回去
        options.mediaId = userData.MediaId;
        options.type = 'image';
    }else if (userData.MsgType === 'voice') {
        // 将用户发送的语音消息， 返回语音识别结果给用户
        options.content = userData.Recognition;
    } else if(userData.MsgType === 'location'){
        // 用户发送的是地理位置消息
        options.content = `地理位置纬度：${userData.Location_X}
                            \n地理位置经度: ${userData.Location_Y}
                            \n地图缩放大小: ${userData.Scale}
                            \n地理位置信息: ${userData.Label}`;
    }else if(userData.MsgType === 'event'){
       //接收事件推送
        if (userData.Event === 'subscribe') {
            // 用户订阅事件
            options.content = '欢迎你关注公众号~';
            if(userData.EventKey){
                // 扫描带参数的二维码 --> 不是普通二维码  活动中使用
                options.content = '欢迎扫描带参数二维码， 关注公众号~';
            }
        }else if(userData.Event === 'unsubscribe'){
            //取消关注
            console.log('无情取关~');
            // 如果不给值， 微信服务器会请求三次
            options.content = '';
        }
    }
    return options;
}

module.exports = {
    handleResponse
}
