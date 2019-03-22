

//引入request-promise-native.
const  rp = require('request-promise-native');
const { writeFileAsync,readFileAsync } = require('../utils/tools');

/*
    发送请求,获取acess_token,保存起来,设置过期时间.
*/
async function getAccessToken(){
    const appId = 'wxf1af390dbfe42ec1';
    const appSecret = '0f9c77f9fcf3b6fe9257804adae4abe5';
    //1.定义请求
    const  url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    // 2.发送请求
    // 下载了 request request-promise-native
    const  result =await rp({method: 'GET', url,json: true});

    // 3.设置过期时间 2小时更新，提前5分钟刷新
    result.expires_in = Date.now()+7200000 -300000;

    // 4.保存为一个文件 ---> 只能保存字符串数据，将js对象转换为json字符串
    await  writeFileAsync('./accessToken.txt',result);

    //5. 返回获取好的access_token
    return result;
}

/*
    得到最终有效的access_token
*/
function fetchAccessToken() {
    //return 会将then和catch的返回值作为结果返回出去.
    // 如果then和catch的返回值是一个promise对象,就直接把它作为结果返回.
    //如果then和catch的返回值不是promise对象,就在它的外面包裹一层promise,并作为结果返回.
    return readFileAsync('./accessToken.txt')
        .then((res)=>{
            if(res.expires_in < Date.now()){
                //之前保存的文件过期了,就重新获取.
                return getAccessToken();
            }else{
                return res;
            }
        })
        .catch((err)=>{
            //如果没有保存过,就重新获取一下access_token.
            return getAccessToken();
        })

}

// 测试获取到有效的access_token.
// (async ()=>{
//         const result = await fetchAccessToken();
//         console.log(result);
//     })()

module.exports = {
    fetchAccessToken
}
