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

/**
 * 获取用户基本信息
 * @param openid_list
 * @param tagid
 * @returns {Promise<void>}
 */
async function getUserInfo(openid){
    // 获取access_token
    const {access_token} =await fetchAccessToken(); //解构赋值.
    // 定义请求
    const  url = `${URL_PREFIX}user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    // 发送请求
    return rp({method: 'GET', url,json:true});;
}

(async ()=>{
    const openid = 'odRYr6EtFCJbTqBr_-qu7OFXEuf4';
    const result =await getUserInfo(openid);
    console.log(result)
})()
