const express = require('express');
const sha1 = require('sha1');
const app = express();

const  { middleWhile } = require('./reply/index');
const  { fetchTicket } = require('./accessToken/ticket');

//配置ejs
app.set('views','views');
app.set('view engine', 'ejs');

//不能访问一个在线的图片,需要将图片下载到本地.用静态资源的方式引入.
app.use(express.static('images'));

//因为中间件里面有返回请求,如果写在中间见后面,需要调用next方法.之前的逻辑需要修改,
// 所以把路由放在中间件前面.
app.get('/search',async  (req,res)=>{
  /*
   1. 参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）。
   2. 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
   3. 这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
 */
  const { ticket } = await  fetchTicket();
  const noncestr =  Math.random().toString().slice(2); //生成随机字符串
  const timestamp = Math.round(Date.now() / 1000);  //时间戳单位是s.
  const url = 'http://73449978.ngrok.io/search';      //当前网页的URL(ngrok网址)
  const arr = [
      `noncestr=${noncestr}`,
      `jsapi_ticket=${ticket}`,
      `timestamp=${timestamp}`,
      `url=${url}`
  ];

  const signature = sha1(arr.sort().join('&'));

  res.render('ticket.ejs', {noncestr,timestamp, signature});
});

//中間件
app.use(middleWhile());

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})
