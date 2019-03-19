/*
    工具函数模块
*/
const { parseString } = require('xml2js');
//获取用户数据方法
function getUserDataAsync(req){
    return new Promise((resolve,reject)=>{
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
}

//获取data数据.将xml数据转换成js对象.
function parseXmlData(xmlData){
    let jsData = null;
    parseString(xmlData,{trim:true},(err, result) => {
        if(!err){
            jsData = result;
        }else {
            jsData = {};
        }
    });
    return jsData;
}

//格式化数据
function formatJsData(jsData){
    let userData = {};
    const  {xml} = jsData;
    for(let key in xml){
        //key 是xml的属性名
        userData[key] = xml[key][0];
    }
    return userData;
}

module.exports = {
    getUserDataAsync,
    parseXmlData,
    formatJsData
}

