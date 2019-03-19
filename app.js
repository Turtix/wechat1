const express = require('express');
const sha1 = require('sha1');


const app = express();


app.use(async (req, res) => {
  console.log(req.query);//微信服务器发送过来的请求参数

  const { signature, echostr, timestamp, nonce } = req.query;
  const token = 'Turtix127';

  // 1）将token、timestamp、nonce三个参数进行字典序排序
  const sortedArr = [token, timestamp, nonce].sort();
  console.log(sortedArr);

  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  const sha1Str = sha1(sortedArr.join(''));
  console.log(sha1Str);

  //3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if(sha1Str === signature){

    //4)返回echostr
    res.end(echostr);
  }else{
    res.end(error);
  }

})

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})
