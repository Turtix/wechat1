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
        content: '请输入你想知道的内容'
    };

    if(userData.Content === '11'){
        options.content = '明月几时有?';
    }else if(userData.Content && userData.Content.indexOf('12') !== -1){
        //模糊匹配
        options.content = '把酒问青天';
    }
    if(userData.MsgType === 'image'){
        //将用户发送的图片，返回回去
        options.mediaId = userData.MediaId;
        options.type = 'image';
    }
    return options;
}

module.exports = {
    handleResponse
}
