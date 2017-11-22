import {
    Ajax,
} from './utils.js';
import getPath from './path.js';
import cookie from './cookie.js';

const pathObj = getPath();

function getBackendCookieBSID() {
    return new Promise((resolve, reject) => {
        Ajax.get({
            url: pathObj.oldUserInfo,
            params: {},
            success: (response) => {
                const json = response;
                if (json.code === 200) {
                    if (json.data.bsid) {
                        // 如果有bsid则默认有shopid,两者成对出现
                        resolve(json.data);
                    } else {
                        reject();
                    }
                } else {
                    console.log('interface code != 200');
                }
            },
            error: () => {
                reject();
                console.log('interface error!');
            },
        });
    });
}

// 20170331 暂时用不上 wxh
// function getAuth() {
//     Ajax.get({
//         url: pathObj.login,
//         params: {
//             urlParam: location.href,
//         },
//         success: (response) => {
//             const json = response;
//             if (json.code === 403) {
//                 console.log('登录失败!');
//                 console.log('url in auth', json.data.loginUrl);
//                 window.location.href = json.data.loginUrl;
//                 // todo 跳转回来后要判断url,在coupon
//             } else {
//                 console.log('code不是403!');
//             }
//         },
//         error: (error) => {
//             console.log('error');
//         },
//     });
// }
function getUrlParam(paramName) {
    const paramList = {};
    if (location.hash) {
        const arr = location.hash.split('?');
        arr[arr.length - 1].split('&').forEach((param) => {
            const p = param.split('=');
            paramList[p[0]] = p[1];
        });
    }
    return paramList[paramName] || '';
}
function getShopInfo() {
    cookie.setCookie('path_url', location.href.split('?')[0], 86400);
    // 新的sso验证，从url中获取bsid
    const bsid = getUrlParam('bsid');
    if (bsid) {
        cookie.setCookie('orderdish_bsid', bsid, 86400);
    }
    return new Promise((resolve) => {
        Ajax.get({
            url: pathObj.shopInfo,
            // url: 'shopInfo',
            success: (res) => {
                const json = res;
                console.log('shop.data', json.data);
                if (json.code === 200) {
                    // 以后所有页面都可以不选择门店，所以无需判断shopId
                    resolve(json.data);
                } else if (json.code === 403) {
                    console.log('interface code != 200');
                    console.log(json.data.loginUrl);
                    window.location.href = json.data.loginUrl;
                }
            },
            error: () => {
                console.log('error');
            },
        });
    });
}

/**
 * 登录后获取商户和账号信息
 * @return {[type]} [description]
 */
function login() {
    return new Promise((resolve) => {
        getShopInfo().then((item) => {
            resolve(item);
        });
        // getBackendCookieBSID().then((cookiedata) => {
        //     // 种cookie
        //     cookie.setCookie('orderdish_bsid', cookiedata.bsid, 86400);
        //     cookie.setCookie('orderdish_shopId', cookiedata.shopId, 86400);
        //     // 查询商户信息
        //     getShopInfo().then((item) => {
        //         resolve(item);
        //     });
        // }, () => {
        //     console.log('没有登录,跳去主页登录');
        //     // 后端也没有cookie时,去登录
        //     window.location.href = pathObj.oldIndex;
        // });
    });
}

/**
 * [shopId切换cookie写入 [http get /shop/ajax/setShopId?shopId=]
 * @param {[type]}   shopId   [description]
 * @param {Function} callback [description]
 */
function setOldDomainCookie(shopId, callback) {
    Ajax.get({
        url: 'setShopId',
        oldModule: true,
        params: {
            shopId,
        },
        success: (res) => {
            if (res.code.toString() === '200') {
                if (callback) {
                    callback();
                }
            } else {
                console.log('interface code != 200');
            }
        },
        error: () => {
            console.log('error');
        },
    });
}

export {
    login,
    getShopInfo,
    getBackendCookieBSID,
    setOldDomainCookie,
};
