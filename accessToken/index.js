/*
  实现微信公众号提供的各个接口
 */
//引入request-promise-native.
const  rp = require('request-promise-native');
const  {fetchAccessToken} = require('./accessToken');
// 菜单配置项
const  menu = {
    'button':[
        {
            'type':'click',
            'name':'首页☀',
            'key':'home'
        },
        {
            'name':'菜单🌏',
            'sub_button':[
                {
                    'type':'view', // 跳转到指定网址
                    'name':'git官网',
                    'url':'https://github.com/Turtix/wechat1.git'
                },
                {
                    'type': 'scancode_waitmsg',
                    'name': '扫码带提示',
                    'key': '扫码带提示'
                },
                {
                    'type': 'scancode_push',
                    'name': '扫码推事件',
                    'key': '扫码推事件',
                },
                {
                    'type': 'pic_sysphoto',
                    'name': '系统拍照发图',
                    'key': 'rselfmenu_1_0'
                },
                {
                    'type': 'pic_photo_or_album',
                    'name': '拍照或者相册发图',
                    'key': 'rselfmenu_1_1'
                }
                ]
        },
        {
            'name':'菜单二🗻',
            'sub_button':[
                {
                    'type': 'pic_weixin',
                    'name': '微信相册发图',
                    'key': 'rselfmenu_1_2'
                },
                {
                    'name': '发送位置',
                    'type': 'location_select',
                    'key': 'rselfmenu_2_0'
                }
                ]
        }
    ]
}

//创建菜单   创建菜单之前必须把之前的菜单删除掉.
async function createMenu(){
    //1.定义请求  需要拿到access_token.
    const {access_token} =await fetchAccessToken(); //解构赋值.
    const  url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;

    // 2.发送请求  需要引入request-promise-native.  rp(...)返回的是一个promise对象.
    const  result =await rp({method: 'POST', url, json: true, body: menu});

    return result;
}

//删除菜单
async function deleteMenu(){
    const {access_token} =await fetchAccessToken(); //解构赋值.
    const  url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`;
    const  result =await rp({method: 'GET', url,json:true});
    return result;
}

//测试创建菜单
//上面async函数返回的是一个promise对象,需要await获取它的值.
(async ()=>{
    let result = await deleteMenu();
    console.log(result);
    result = await createMenu();
    console.log(result);
})()
