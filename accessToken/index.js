/*
  定义获取access_token的模块
    1. 是什么？
      是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用access_token
    2. 特点：
      - 有效期2小时，（2小时必须更新1次， 重复获取将导致上次获取的access_token失效。）
      - 唯一性
      - 大小512字符
    3. 请求地址
      https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    4. 请求方式 GET
    5. 设计
      - 第一次：发送请求、获取access_token，保存起来，设置过期时间
      - 第二次：读取本地保存access_token，判断有没有过期
        - 没有过期， 直接使用
        - 过期了， 重新发送请求、获取access_token，保存起来，设置过期时间
    6. 整理
       一上来读取本地保存access_token，
        有：
          判断有没有过期
            - 没有过期， 直接使用
            - 过期了， 重新发送请求、获取access_token，保存起来，设置过期时间
        没有
          发送请求、获取access_token，保存起来，设置过期时间

 */
/*
    发送请求,获取acess_token,保存起来,设置过期时间.
*/
//引入request-promise-native.
const  rp = require('request-promise-native');
const  {writeFile} = require('fs');

async function getAccessToken(){
    const appId = 'wxf1af390dbfe42ec1';
    const appSecret = '0f9c77f9fcf3b6fe9257804adae4abe5';
    //定义请求
    const  url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    // 发送请求
    // 下载了 request request-promise-native
    const  result =await rp({method: 'GET', url,json: true});
    // console.log(result);

    // 设置过期时间 2小时更新，提前5分钟刷新
    result.expires_in = Date.now()+7200000 -300000;

    // 保存为一个文件 ---> 只能保存字符串数据，将js对象转换为json字符串
    writeFile('./accessToken.txt',JSON.stringify(result), err =>{
            if(!err){
                console.log('acess_token文件保存成功!')
            }else {
                console.log(err);
            }
    });

    // 返回获取好的access_token
    return result;
}
getAccessToken();
