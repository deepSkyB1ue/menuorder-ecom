import config from './config.js';
import getEnv from './env.js';

function getPath() {
    let pathObj = null;
    const envName = getEnv();
    const moduleName = location.hash.substr(2).split('?')[0].split('/')[0];

    // 判断模块，默认shop
    pathObj = config.module[moduleName] ? config.module[moduleName] : config.module.default;

    // 模块自定义配置
    const defaultEnv = config.env[envName];
    const envObj = pathObj[envName] ? pathObj[envName] : config.env[envName];
    return {
        action: `${location.protocol}//${envObj.serverDomain}${pathObj.action}`,
        ajax: `${location.protocol}//${envObj.serverDomain}${pathObj.ajax}`,
        ajaxExe: `${location.protocol}//${envObj.serverDomain}/exe${pathObj.ajax}`,
        ajaxOld: `${location.protocol}//${envObj.oldDomain}${pathObj.oldModule}`,
        login: `${location.protocol}//${envObj.login}${pathObj.action}`,
        inEcom: pathObj.inEcom,
        oldIndex: `${location.protocol}//${envObj.oldDomain}${pathObj.oldModule}${config.oldIndex}`,
        oldDomain: `${location.protocol}//${envObj.oldDomain}`,
        oldUserInfo: `${location.protocol}//${envObj.oldDomain}${pathObj.oldModule}${config.oldUserInfo}`,
        shopInfo: `${location.protocol}//${defaultEnv.serverDomain}/ajax/shop/shopInfo`,
        serverDomain: `${location.protocol}//${envObj.serverDomain}`,
    };
}

export default getPath;
