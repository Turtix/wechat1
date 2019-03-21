/*
  实现微信公众号提供的各个接口
 */
//引入request-promise-native.
const  rp = require('request-promise-native');
const  {fetchAccessToken} = require('./accessToken');

const URL_PREFIX = 'https://api.weixin.qq.com/cgi-bin/';

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

/**
 * 创建菜单   创建菜单之前必须把之前的菜单删除掉.
 * @returns {Promise<void>}
 */
async function createMenu(){
    //1.定义请求  需要拿到access_token.
    const {access_token} =await fetchAccessToken(); //解构赋值.
    const  url = `${URL_PREFIX}menu/create?access_token=${access_token}`;

    // 2.发送请求  需要引入request-promise-native.  rp(...)返回的是一个promise对象.
    const  result =await rp({method: 'POST', url, json: true, body: menu});

    return result;
}

/**
 * 删除菜单
 * @returns {Promise<void>}
 */
async function deleteMenu(){
    const {access_token} =await fetchAccessToken(); //解构赋值.
    const  url = `${URL_PREFIX}menu/delete?access_token=${access_token}`;

    return rp({method: 'GET', url,json:true});;
}

/**
 * 创建标签
 * @param name  标签名
 * @returns {Promise<void>}
 */
async function createTag(name){
    // 获取access_token
    const {access_token} =await fetchAccessToken(); //解构赋值.
    // 定义请求
    const  url = `${URL_PREFIX}tags/create?access_token=${access_token}`;
    // 发送请求
    return rp({method: 'POST', url,json:true,body:{tag: {name} }});;
}

/**
 * 获取公众号已创建的标签
 * @returns {Promise<void>}
 */
async function getAllTags(){
    // 获取access_token
    const {access_token} =await fetchAccessToken(); //解构赋值.
    // 定义请求
    const  url = `${URL_PREFIX}tags/get?access_token=${access_token}`;
    // 发送请求
    return rp({method: 'GET', url,json:true});;
}

/**
 * 获取标签下的所有粉丝列表
 * @param tagid  标签id
 * @param next_openid  从哪个用户开始拉取
 * @returns {Promise<void>}
 */
async function getTagUsers(tagid,next_openid){
    // 获取access_token
    const {access_token} =await fetchAccessToken(); //解构赋值.
    // 定义请求
    const  url = `${URL_PREFIX}user/tag/get?access_token=${access_token}`;
    const options = {
            tagid,
            next_openid  //第一个拉取的OPENID，不填默认从头开始拉取
        }
    // 发送请求
    return rp({method: 'POST', url,json:true,body:options});;
}

/**
 *  批量为多个用户打标签
 * @param openid_list  用户列表(一个字符串数组)
 * @param tagid  标签id
 * @returns {Promise<void>}
 */
async function batchUsersTag(openid_list,tagid){
    // 获取access_token
    const {access_token} =await fetchAccessToken(); //解构赋值.
    // 定义请求
    const  url = `${URL_PREFIX}tags/members/batchtagging?access_token=${access_token}`;
    const options = {
        openid_list, //粉丝列表
        tagid
    }
    // 发送请求
    return rp({method: 'POST', url,json:true,body:options});;
}

//测试创建菜单
//上面async函数返回的是一个promise对象,需要await获取它的值.
(async ()=>{
    //创建标签:  深圳的粉丝
    // let result1  = await createTag('广东');
    // console.log(result1);  //{ tag: { id: 103, name: '广东', count: 2 } }

    //获取公众号已创建的标签
    const  result = await getAllTags();
    console.log(result);
        /*
        { tags:
           [ { id: 2, name: '星标组', count: 0 },
             { id: 100, name: '深圳的粉丝', count: 0 },
             { id: 101, name: '铁粉', count: 0 },
             { id: 102, name: '铁粉~', count: 0 },
             { id: 103, name: '广东', count: 2 } ] }
        */
    //批量为多个用户打标签
     var arr = ['odRYr6MoiP3rw6qbLmzolhG2eTvo','odRYr6EtFCJbTqBr_-qu7OFXEuf4'];
     const result2 = await batchUsersTag(arr,result.tags[3].id);
    console.log(result2);  //{ errcode: 0, errmsg: 'ok' }

    // //获取标签下的所有粉丝列表.
    const result3 = await getTagUsers(result.tags[3].id);
    console.log(result3);
    /*  { count: 2,
        data:
        { openid:
            [ 'odRYr6MoiP3rw6qbLmzolhG2eTvo',
                'odRYr6EtFCJbTqBr_-qu7OFXEuf4' ] },
        next_openid: 'odRYr6EtFCJbTqBr_-qu7OFXEuf4' }
        */
})()
