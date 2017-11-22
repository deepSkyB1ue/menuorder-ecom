<template>
    <authcode-confirm :visible="confirmInfo.visible"
                      :title="confirmInfo.title"
                      :confirmBtnTitle="confirmInfo.confirmBtnTitle"
                      :authCode="confirmInfo.authCode"
                      @close="onConfirmClose">
    </authcode-confirm>
</template>

<script>
/* eslint-disable no-useless-escape */
/* eslint-disable import/no-unresolved */
import AuthCodeConfirm from '@/components/pages/authcode/authcode-confirm';
import { Ajax, getUrlParam } from '../lib/utils.js';
import getEnv from '../lib/env.js';

export default {
    name: 'AuthCodeQuery',
    components: {
        'authcode-confirm': AuthCodeConfirm,
    },
    data() {
        return {
            shopId: this.$route.query.shopId || getUrlParam('shopId'),
            bsid: this.$route.query.BSID || getUrlParam('BSID'),
            loading: {},
            confirmInfo: {
                visible: true,
                title: '',
                confirmBtnTitle: '',
                authCode: '',
                shouldClose: false,
            },
        };
    },
    mounted() {
        this.confirmInfo = {
            visible: true,
            title: '请去登录页输入门店账号、密码来找回授权码，若忘记账号密码请联系美团点评销售。',
            confirmBtnTitle: '打开登录页',
            authCode: '',
            shouldClose: false,
        };
        if (this.bsid) {
            this.getShopAuthCodeRequest();
        }
    },
    methods: {
        onConfirmClose() {
            if (this.confirmInfo.shouldClose) {
                this.callNativeCloseWindow();
            } else {
                let loginURL = getEnv() === 'beta' ? 'http:\/\/epassport.sjst.beta.sankuai.com' : 'https:\/\/epassport.meituan.com';
                loginURL += '\/account\/unitivelogin?bg_source=1&service=orderdish-pc-client&continue=';
                loginURL += encodeURIComponent(location.origin + location.pathname + location.hash);

                window.location.href = loginURL;
            }
        },

        callNativeCloseWindow() {
            // 关闭窗口
            if ('authCodeQuery' in window) {
                window.authCodeQuery({
                    request: 'closeDialog',
                    onSuccess() {
                    },
                    onFailure(errorCode, errorMessage) {
                        console.error(`Error:${errorMessage}`);
                    },
                });
            } else {
                console.error("Error: authCodeQuery isn't registered");
            }
        },

        getShopAuthCodeRequest() {
            this.loading = this.$loading();
            Ajax.get({
                url: 'getShopAuthCode',
                params: {
                    shopId: this.shopId,
                    bsid: this.bsid,
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.confirmInfo = {
                            visible: true,
                            title: '登录验证成功，您的授权码是',
                            confirmBtnTitle: '记住了',
                            authCode: res.data.authCode,
                            shouldClose: true,
                        };
                    } else {
                        this.confirmInfo = {
                            visible: true,
                            title: res.msg || '网络错误，请重试',
                            confirmBtnTitle: '关闭',
                            authCode: '',
                            shouldClose: true,
                        };
                    }
                },
                error: (res) => {
                    this.loading.$stopLoading();
                    this.confirmInfo = {
                        visible: true,
                        title: res.msg || '网络错误，请重试',
                        confirmBtnTitle: '关闭',
                        authCode: '',
                        shouldClose: true,
                    };
                },
            });
        },
    },
};
</script>
