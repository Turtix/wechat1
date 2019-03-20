const express = require('express');

const app = express();

const  {middleWhile} = require('./reply/index');

//中間件
app.use(middleWhile());

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})
