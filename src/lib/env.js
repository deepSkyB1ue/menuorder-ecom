/* eslint-disable no-restricted-syntax */
import config from './config.js';

/**
 * 获取当前环境（默认beta）
 * @return {[type]} bete/prod [当前环境]
 */
function getEnv() {
    let env = 'beta';
    // 判断环境
    for (const envName in config.env) {
        if (location.host === config.env[envName].domain) {
            env = envName;
        }
    }
    return env;
}

export default getEnv;
