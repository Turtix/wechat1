

//引入request-promise-native.
const  rp = require('request-promise-native');
const  {fetchAccessToken} = require('./accessToken');
const { writeFileAsync,readFileAsync } = require('../utils/tools');

/*
    发送请求,获取ticket,保存起来,设置过期时间.
*/
async function getTicket(){
    // 获取access_token
    const {access_token} = await fetchAccessToken(); //解构赋值.
    //1.定义请求
    const  url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;

    // 2.发送请求
    // 下载了 request request-promise-native
    const  result =await rp({method: 'GET', url,json: true});

    // 3.设置过期时间 2小时更新，提前5分钟刷新
    result.expires_in = Date.now()+7200000 -300000;

    //保存文件过滤掉 "errcode":0,"errmsg":"ok"
    const  ticket = {
        ticket:result.ticket,
        expires_in:result.expires_in
    }
    await  writeFileAsync('./ticket.txt',ticket);

    //5. 返回获取好的ticket
    return ticket;
}

/*
    得到最终有效的ticket
*/
function fetchTicket() {

    return readFileAsync('./ticket.txt')
        .then((res)=>{
            if(res.expires_in < Date.now()){
                return getTicket();
            }else{
                return res;
            }
        })
        .catch((err)=>{
            return getTicket();
        })

}

// 测试获取到有效的ticket.
(async () => {
    const result = await fetchTicket();
    console.log(result);
})()

module.exports = {
    fetchTicket
}
