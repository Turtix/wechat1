const express = require('express');
const sha1 = require('sha1');
const { parseString } = require('xml2js');

const app = express();


app.use(async (req, res) => {
  // console.log(req.query);//微信服务器发送过来的请求参数

  const { signature, echostr, timestamp, nonce } = req.query;
  const token = 'Turtix127';

  // 1）将token、timestamp、nonce三个参数进行字典序排序
  const sortedArr = [token, timestamp, nonce].sort();
  // console.log(sortedArr);

  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  const sha1Str = sha1(sortedArr.join(''));
  // console.log(sha1Str);
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

      const xmlData = await new Promise((resolve,reject)=>{
        let xmlData = '';
        //用户发送来的数据通过req.body获取不到.需要用ondata获取.
        req.on('data',data => {
          xmlData += data.toString();
          /*
           <xml>
           <ToUserName><![CDATA[gh_4fe7faab4d6c]]></ToUserName> 开发者微信测试号id
           <FromUserName><![CDATA[oAsoR1iP-_D3LZIwNCnK8BFotmJc]]></FromUserName>  用户的openid
           <CreateTime>1552976640</CreateTime> 发送消息的时间戳
           <MsgType><![CDATA[text]]></MsgType> 发送消息的类型
           <Content><![CDATA[222]]></Content>  发送消息具体内容
           <MsgId>22233279597873298</MsgId>    发送消息的id （默认保留3天， 3天后会销毁）
           </xml>
            */
        })
        //ondata事件可能被触发多次,所以需要链式用onend事件来判断是否结束.
        .on('end',()=>{
          //触发改事件,说明数据加载完毕.
          resolve(xmlData);
        })
      })

      //获取data数据.
      let jsData = null;
      const result =  parseString(xmlData,{trim:true},(err, result) => {
        if(!err){
          jsData = result;
        }else{
          jsData = {};
        }
        return jsData;
      });

      //格式化数据,数据转化为一个对象.
      let userData = {};
      const  {xml} = jsData;
      for(let key in xml){
        //key 是xml的属性名
        userData[key] = xml[key][0];
      }
      // console.log(userData);

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
