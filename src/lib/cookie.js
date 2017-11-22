import getEnv from './env.js';

const envName = getEnv(); // beta或者prd

const cookie = {
    // 使用方法：setCookie('username','Darren',86400)
    setCookie(cName, value, expireTime, prefix = true) {
        let cookieName = '';
        if (prefix) {
            cookieName = `${envName}_${cName}`;
        } else {
            cookieName = cName;
        }
        const exdate = new Date();
        exdate.setSeconds(exdate.getSeconds() + expireTime);
        document.cookie = `${cookieName}=${escape(value)}${(expireTime == null) ? '' : `;expires=${exdate.toGMTString()}`};path=/;domain=meituan.com`;
    },
    getCookie(cName, prefix = true) {
        let cookieName = '';
        if (prefix) {
            cookieName = `${envName}_${cName}`;
        } else {
            cookieName = cName;
        }
        let cStart;
        let cEnd;
        if (document.cookie.length > 0) {
            cStart = document.cookie.indexOf(`${cookieName}=`);
            if (cStart !== -1) {
                cStart = cStart + cookieName.length + 1;
                cEnd = document.cookie.indexOf(';', cStart);
                if (cEnd === -1) {
                    cEnd = document.cookie.length;
                }
                return unescape(document.cookie.substring(cStart, cEnd));
            }
        }
        return '';
    },
};

export default cookie;
