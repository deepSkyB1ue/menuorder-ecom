<template>
    <div>
        <div class="img-cont">
        </div>
        <div class='download-up' @click='download()' v-show='showDownloadBtn'>
            立即下载
        </div>
        <div class='download-down' @click='download()' v-show='showDownloadBtn'>
            立即下载
        </div>
    </div>
</template>
<script>
/* eslint-disable import/no-unresolved */
import whatever from '@/lib/whatever-adaptor.js';
import {
    getUrlParam,
} from '../../../lib/utils.js';

export default {
    data() {
        return {
            showDownloadBtn: true,
        };
    },
    mounted() {
        whatever.sendPV({
            pageId: 'cloud-download-page',
            activity_code: getUrlParam('activity_code'),
        });
        const browser = {
            versions: (function () {
                const u = navigator.userAgent;
                return { // 移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, // IE内核
                    presto: u.indexOf('Presto') > -1, // opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, // 是否iPad
                    webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
                };
            }()),
            language: (navigator.browserLanguage || navigator.language).toLowerCase(),
        };

        // 移动端隐藏下载按钮
        if (browser.versions.mobile || browser.versions.ios || browser.versions.android ||
            browser.versions.iPhone || browser.versions.iPad) {
            this.showDownloadBtn = false;
        }
    },
    methods: {
        download() {
            const downloadUrl = 'http://mss.sankuai.com/v1/mss_fcbd6b31d19c4885ba1401eb446fe44c/dbh/releases/v2.7.0.100/yundian_windows_2_7_0_100.exe';
            whatever.report({
                pageId: 'cloud-download',
                action: 'click',
                module: 'cloud-download-click',
                activity_code: getUrlParam('activity_code'),
            });
            window.open(downloadUrl, '_blank');
        },
    },
};
</script>
<style lang='less'>
* {
    margin: 0;
    padding: 0;
}

.img-cont {
    background-size: 100% auto;
    background-image: url('../../../assets/img/article-board.png');
    background-size: 100% 100%;
    padding-bottom: 216%;
}

.download-up {
    color: #fff;
    position: absolute;
    top: 0;
    left: 50%;
    margin-top: 30%;
    width: 250px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    border-radius: 10px;
    background: #4285f4;
    cursor: pointer;
}

.download-down {
    color: #fff;
    position: absolute;
    top: 0;
    left: 40%;
    margin-top: 190%;
    width: 320px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    border-radius: 10px;
    background: #4285f4;
    cursor: pointer;
}
</style>
