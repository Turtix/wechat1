const express = require('express');
const sha1 = require('sha1');


const app = express();

const {getUserDataAsync,parseXmlData,formatJsData} = require('./utils/tools');

app.use(async (req, res) => {
  // console.log(req.query);//微信服务器发送过来的请求参数

  const { signature, echostr, timestamp, nonce } = req.query;
  const token = 'Turtix127';

  // 1）将token、timestamp、nonce三个参数进行字典序排序
  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  const sha1Str = sha1([token, timestamp, nonce].sort().join(''));

  if(req.mathod === 'GET'){
    //3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(sha1Str === signature){

      //4)说明消息来自于微信服务器,返回echostr
      res.end(echostr);
    }else{
      res.end('error');
    }
  }else if(req.method === 'POST'){
      //说明是用户发送过来的消息.

      //过滤掉不是微信服务器发送的情求.拦截非法访问.
      if(sha1Str !== signature){
        res.end('error');
        return;
      }

      //获取用户发送的消息.
      const xmlData = await  getUserDataAsync(req);

      //获取data数据.将xml数据转换成js对象.
      const jsData = parseXmlData(xmlData);

      //格式化数据,数据转化为一个对象.
      const userData = formatJsData(jsData);

      //实现自动回复功能
      let content = '请输入你想知道的内容';
      if(userData.Content === '11'){
        content = '明月几时有?';
      }else if(userData.Content.indexOf('12') !== -1){
        //模糊匹配
        content = '把酒问青天';
      }

      const replayMassage = `<xml>
                <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
                <CreateTime>${Date.now()}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[${content}]]></Content>
              </xml>`;
      res.send(replayMassage);
  }else{
    res.end('error');

  }


})

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})
