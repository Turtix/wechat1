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
        content:'欢迎关注公众号~'
    };

    if(userData.MsgType === 'text'){
        if(userData.Content === '11'){
            options.content = '明月几时有?';
        }else if(userData.Content && userData.Content.indexOf('12') !== -1){
            //模糊匹配
            options.content = '把酒问青天';
        }else {
            options.content = '请输入你想知道的内容';
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
    }
    return options;
}

module.exports = {
    handleResponse
}
