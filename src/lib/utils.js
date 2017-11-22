/* eslint-disable import/no-unresolved */
import axios from 'axios';
import Clipboard from 'clipboard';
import KNB from '@dp/knb';
import whereami from '@dp/whereami';
import Toast from '@/components/ui-base/toast/index';

import getPath from './path.js';
import whatever from './whatever-adaptor.js';


axios.defaults.withCredentials = true;

/**
 * [ajax封装，包括环境域名判断，路径拼接]
 * @param  {[type]} options []
 * options.url
 * options.params
 * options.success
 * options.error
 * @return {[type]}[description]
 */
const header = {
    'Content-Type': 'application/json;charset=UTF-8',
};
/**
 * [getAjaxUrl description]
 * @param  {[type]} url       [description]
 * @param  {[type]} oldModule [ajax options中定义一个属性oldModule来标识请求老后端项目的接口，url规则和新项目不同]
 * @param  {[type]} exe       [ajax options中定义一个属性exe来标识请求exe的接口，url规则和ecom的不同]
 * @return {[type]}           [description]
 */
function getAjaxUrl(options) {
    if (/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(options.url)) {
        return options.url;
    }
    if (options.oldModule) {
        return `${getPath().ajaxOld}/ajax/${options.url}`;
    }
    if (options.exe) {
        return `${getPath().ajaxExe}/${options.url}`;
    }
    return `${getPath().ajax}/${options.url}`;
}

function getUrlParam(paramName) {
    const paramList = {};
    if (location.search) {
        location.search.substr(1, location.search.length - 1).split('&').forEach((param) => {
            const p = param.split('=');
            paramList[p[0]] = p[1];
        });
    }
    return paramList[paramName] || '';
}

function isMiaofuPage(route) {
    if (route && route.meta) {
        return route.meta.businessType.toString() === '10';
    }
    return document.location.pathname.indexOf('miaofu') >= 0 || document.location.hash.indexOf('miaofu') >= 0;
}

function reportOperTime(options) {
    whatever.report({
        pageId: options.pageId,
        module: options.module,
        action: 'click',
        pageOperTime: performance.now() - window.startTime,
    });
}

function getLocation(options) {
    KNB.getUA({
        success(ua) {
            const config = {
                timeout: 5000,
            };
            if (ua.osName === 'android') {
                config.disables = ['weixin']; // 微信定位部分安卓机会crash（新版本会修复），暂时禁掉（会启用h5定位）
            }
            whereami.config(config);
            whereami(options.success, options.fail);
        },
    });
}

function dealResponse(result, options) {
    result.then((response) => {
        if (response && response.data) {
            if (options.success) {
                options.success(response.data);
            }
        } else if (options.error) {
            options.error(response);
        }
    })
        .catch((error) => {
            if (options.error) {
                options.error(error);
            }
        });
}
const Ajax = {
    get(options) {
        const result = axios.get(getAjaxUrl(options), {
            params: options.params,
        });
        dealResponse(result, options);
    },
    post(options) {
        const result = axios.post(getAjaxUrl(options), options.params, {
            headers: header,
        });
        dealResponse(result, options);
    },
    delete(options) {
        const result = axios.delete(getAjaxUrl(options), {
            params: options.params,
        });
        dealResponse(result, options);
    },
    put(options) {
        const result = axios.put(getAjaxUrl(options), options.params, {
            headers: header,
        });
        dealResponse(result, options);
    },
};

function copyClipboard(str) {
    const id = `#${str}`;
    const clipboard = new Clipboard(id);
    clipboard.on('success', (e) => {
        Toast({
            text: '复制成功',
            duration: 1000,
        });
        e.clearSelection();
        clipboard.destroy();
    });
    clipboard.on('error', (e) => {
        Toast({
            text: '复制失败，请重试',
            duration: 1000,
        });
        e.clearSelection();
        clipboard.destroy();
    });
}

export {
    Ajax,
    getUrlParam,
    isMiaofuPage,
    reportOperTime,
    getLocation,
    copyClipboard,
};
